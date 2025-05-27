import api from "../../axiosConfig.js";

export const fetchAllMatkul = async (prodi) => {
    try {
        const response = await api.get(`/api/prodi/matkul/${prodi}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addMatkul = async (payload) => {
    try {
        const response = await api.post('/api/prodi/matkul', payload);
        return response.data;
    } catch (error) {
        console.error("Error adding matkul:", error);
        throw error;
    }
};
export const editMatkul = async (id, payload) => {
    try {
        const response = await api.put(`/api/prodi/matkul/${id}`, payload);
        return response.data;
    } catch (error) {
        console.error("Error editing matkul:", error);
        throw error;
    }
};
