// src/controllers/authController.js
import { login } from "../api/authService.js";
import { setUser, setToken } from "../redux/authSlice.jsx";

export const handleLogin = async (id, password, dispatch) => {
    try {
        const data = await login(id, password);

        if (!data || !data.token) {
            throw new Error("Login gagal! Token tidak ditemukan.");
        }

        dispatch(setUser(data.user));
        dispatch(setToken(data.token));

        return data;
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
};
