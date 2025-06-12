import axios from "../../axiosConfig.js";

export const getJadwalDosen = async (dosenId) => {
    try {
        const response = await axios.get(`/api/dosen/jadwal-dosen/${dosenId}`);
        console.log("Response api : ", response)
        return response.data;
    } catch (error) {
        console.error("Error fetching jadwal dosen:", error);
        throw error;
    }
};

export const clearJadwal = async (dosenId) =>{
    try {
        const response = await axios.delete(`/api/dosen/jadwal/clear/${dosenId}`)
        return response.data;
    }catch (error){
        console.error("Error clearing jadwal ", error)
        throw error;
    }
}
