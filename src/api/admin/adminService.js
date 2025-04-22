import api from '../../axiosConfig.js'

export const fetchAllUser = async ()=>{
    try {
        const response = await api.get('/api/admin/users')
        return response
    }catch (e) {
        console.log("Error : ", e)
        throw e
    }
}

export const fetchAllProdi = async () => {
    try {
        const response = await api.get('/api/prodi');
        return response.data.data;
    } catch (e) {
        console.error("Error fetching prodi:", e);
        throw e;
    }
};


export const updateUser = async (userId, updatedData) => {
    try {
        const response = await api.put(`/api/admin/users/${userId}`, updatedData);
        return response;
    } catch (e) {
        console.log("Error updating user:", e);
        throw e;
    }
};

export const createUser = async (userData) => {
    try {
        const response = await api.post("/api/admin/register", userData);
        return response.data;
    } catch (e) {
        console.error("Error creating user:", e);
        throw e;
    }
};
