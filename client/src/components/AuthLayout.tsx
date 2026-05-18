import { ReactNode } from "react";

interface Props {
    children: ReactNode;
    title: string;
}

const AuthLayout = ({ children, title }: Props) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] px-4">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-purple-700/20 blur-3xl pointer-events-none" />

            <div className="relative w-full max-w-md bg-[#141418]/80 backdrop-blur-lg shadow-lg border border-purple-500/20 rounded-2xl p-8">
                <h1 className="text-3xl font-bold text-center text-white">
                    <span className="text-purple-400">{title}</span>
                </h1>
                <div className="mt-6">{children}</div>
            </div>
        </div>
    );
};

export default AuthLayout;
