import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

const Register = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch("https://api.xlr8aerospace.com/api/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            setMessage(data.message || "User Registered");
        } catch {
            setMessage("⚠ Something went wrong");
        }
    };

    return (
        <AuthLayout title="Create Account">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username */}
                <div>
                    <label className="text-sm text-gray-300">Username</label>
                    <input
                        name="username"
                        placeholder="Your name"
                        className="w-full p-3 mt-1 rounded-md bg-black/40 text-white border border-purple-500/30 focus:border-purple-400 outline-none transition-all"
                        onChange={handleChange}
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="text-sm text-gray-300">Email</label>
                    <input
                        name="email"
                        type="email"
                        placeholder="email@example.com"
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
                    Sign Up
                </button>

                {message && (
                    <p className="text-center text-purple-300 text-sm mt-3">
                        {message}
                    </p>
                )}

                {/* 🔗 Login link */}
                <p className="text-center text-sm text-gray-400 mt-4">
                    Already have an account?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="text-purple-400 hover:text-purple-300 cursor-pointer font-medium"
                    >
                        Login
                    </span>
                </p>
            </form>
        </AuthLayout>
    );
};

export default Register;
    