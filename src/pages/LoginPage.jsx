// src/pages/LoginPage.jsx
import { useState } from "react";
import { useDispatch } from "react-redux";
import { handleLogin } from "../controller/authController.js";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await handleLogin(id, password, dispatch, navigate);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-sm p-6 bg-white shadow-md rounded-md">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Login</h2>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-gray-600 text-sm font-medium mb-1">ID</label>
                        <input
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0db0bb]"
                            placeholder="Enter your ID"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0db0bb]"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#0db0bb] hover:bg-[#0a99a1] text-white font-semibold py-2 rounded-md transition-all"
                    >
                        Login
                    </button>
                </form>

            </div>
        </div>
    );
}
