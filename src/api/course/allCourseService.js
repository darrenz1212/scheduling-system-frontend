import api from "../../axiosConfig.js"

export const fetchAllMatkul = async () => {
    try {
        const response = await api.get('/api/prodi/matkul')
        return response.data
    }catch (error){
        console.error(error)
        throw error
    }
}

