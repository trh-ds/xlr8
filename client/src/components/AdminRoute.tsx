import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Dashboard from "../pages/Dashboard";

const AdminRoute = () => {
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const verifyAdmin = async () => {
            try {
                const res = await fetch(
                    "https://api.xlr8aerospace.com/api/users/admin-only",
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                setAuthorized(res.ok);
            } catch {
                setAuthorized(false);
            } finally {
                setLoading(false);
            }
        };

        verifyAdmin();
    }, []);

    useEffect(() => {
        if (!loading && !authorized) {
            alert("⚠ Admin access required. Please log in as an admin.");
        }
    }, [loading, authorized]);

    if (loading) return null;

    if (!authorized) {
        return <Navigate to="/login" replace />;
    }

    return <Dashboard />;
};

export default AdminRoute;
