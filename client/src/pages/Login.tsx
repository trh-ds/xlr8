import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch(
                "https://api.xlr8aerospace.com/api/users/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include", // ✅ REQUIRED
                    body: JSON.stringify(form),
                }
            );


            const data = await res.json();

            if (!res.ok) {
                setMessage(data.message || "Login failed");
                return;
            }


            if (data.user?.role === "admin") {
                navigate("/dashboard", { replace: true });
            } else {
                navigate("/", { replace: true });
            }

        } catch {
            setMessage("⚠ Something went wrong");
        }
    };

    return (
        <AuthLayout title="Welcome Back">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                    <label className="text-sm text-gray-300">Email</label>
                    <input
                        name="email"
                        type="email"
                        placeholder="john@domain.com"
                        className="w-full p-3 mt-1 rounded-md bg-black/40 text-white border border-purple-500/30 focus:border-purple-400 outline-none transition-all"
                        onChange={handleChange}
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="text-sm text-gray-300">Password</label>
                    <input
                        name="password"
                        type="password"
                        placeholder="••••••••••"
                        className="w-full p-3 mt-1 rounded-md bg-black/40 text-white border border-purple-500/30 focus:border-purple-400 outline-none transition-all"
                        onChange={handleChange}
                    />
                </div>

                {/* Button */}
                <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-700 hover:opacity-90 transition rounded-md font-semibold text-white shadow-md"
                >
                    Login
                </button>

                {message && (
                    <p className="text-center text-purple-300 text-sm mt-3">
                        {message}
                    </p>
                )}

                {/* 🔗 Register link */}
                <p className="text-center text-sm text-gray-400 mt-4">
                    Don’t have an account?{" "}
                    <span
                        onClick={() => navigate("/register")}
                        className="text-purple-400 hover:text-purple-300 cursor-pointer font-medium"
                    >
                        Register
                    </span>
                </p>
            </form>
        </AuthLayout>
    );
};

export default Login;
