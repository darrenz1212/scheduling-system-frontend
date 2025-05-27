import axios from "axios";
import store from "./redux/store.js";

const API_BASE_URL = "http://127.0.0.1:8000";

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Interceptor untuk attach token
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

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
            window.location.href = "/access-denied";
        }
        return Promise.reject(error);
    }
);

export default api;
