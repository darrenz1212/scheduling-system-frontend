import axios from "axios";
import store from "./redux/store.js"; // Import store Redux

const API_BASE_URL = "http://127.0.0.1:8000";

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = store.getState().auth.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
