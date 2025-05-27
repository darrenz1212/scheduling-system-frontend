import axios from "axios";


const API_BASE_URL = "http://127.0.0.1:8000";

export const login = async (id, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/login`, { id, password });

        console.log("API Response:", response.data); // Debugging
        if (!response.data || !response.data.token) {
            throw new Error("Invalid login response: No token received");
        }

        return response.data;
    } catch (error) {
        console.error(" Error in authService.js:", error);
        throw error.response ? error.response.data : { message: "Server error" };
    }
};
