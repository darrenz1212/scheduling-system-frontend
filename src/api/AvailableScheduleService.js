import api from "../axiosConfig.js"

export const addAvailableScheduleService = async (scheduleData) => {
    try {
        const response = await api.post("/api/dosen/addjadwal", scheduleData);
        return response.data;
    } catch (error) {
        console.error("Error in API availableScheduleService:", error.response?.data || error.message);
        throw error;
    }
};

export const matkulList = async (id) =>{
    try {
        const response = await api.get(`/api/dosen/matkul-aktif/dosen/${id}`);
        console.log("Respone Console :  ",response)
        return response.data;
    }catch (e){
        console.error("Error in matkulList",e)
        return []
    }
}

export const dosenAvailableSchedule = async (id) =>{
    try {
        const response = await api.get(`http://localhost:8000/api/dosen/jadwal/${id}`)
        return response.data.result
    }catch (e){
        console.error("Error in dosenAvailableSchedule : ", e )
    }

}
export const updateAvailableSchedule = async (idJadwal, updatedData) => {
    try {
        const response = await api.put(`/api/dosen/jadwal/${idJadwal}`, updatedData);
        return response.data;
    } catch (error) {
        console.error("Error in updateAvailableSchedule:", error.response?.data || error.message);
        throw error;
    }
};

export const fetchAllAvailableSchedule = async ()=>{
    try {
        const response = await api.get(`/api/prodi/jadwaldosen`)
        return response.data
    }catch (error) {
        console.error("Error in fetching URL")
        throw error
    }
}

export const fetchDosenList = async () => {
    try {
        const response = await api.get(`/api/prodi/getdosen?role=Dosen`);
        const result = response.data.result || [];
        return result.filter((dosen) => dosen.status === "Aktif");
    } catch (error) {
        console.error("Error fetching dosen list");
        throw error;
    }
};

