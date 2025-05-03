import api from '../../axiosConfig';

export const fetchAllPeriode = async () => {
    try {
        const response = await api.get('/api/prodi/periode');
        return response.data;
    } catch (error) {
        console.error("Error fetching periode:", error);
        throw error;
    }
};

export const setActivePeriode = async (periodeId) => {
    try {
        const response = await api.put('/api/prodi/periode/active', { periode_id: periodeId });
        return response.data;
    } catch (error) {
        console.error("Error setting active periode:", error);
        throw error;
    }
};

export const addPeriode = async (nama) => {
    try {
        const response = await api.post('/api/prodi/periode', { nama });
        return response.data;
    } catch (error) {
        console.error("Error adding periode:", error);
        throw error;
    }
};

export const editPeriode = async (id, nama) => {
    try {
        const response = await api.put(`/api/prodi/periode/${id}`, { nama });
        return response.data;
    } catch (error) {
        console.error("Error editing periode:", error);
        throw error;
    }
};
