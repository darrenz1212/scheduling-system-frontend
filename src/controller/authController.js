// src/controllers/authController.js
import { login } from "../api/authService.js";
import { setUser, setToken } from "../redux/authSlice.jsx";

export const handleLogin = async (id, password, dispatch, navigate) => {
    try {
        const data = await login(id, password);

        if (!data || !data.token) {
            throw new Error("Login gagal! Token tidak ditemukan.");
        }

        dispatch(setUser(data.user));
        dispatch(setToken(data.token));

        if (data.user.role === "Dosen") {
            navigate("/dosen/schedule");
        } else if(data.user.role === "Prodi"){
            navigate('/prodi/schedule')
        }else if(data.user.role === "Admin"){
            navigate('/admin/home')
        }
        return data;
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
};
