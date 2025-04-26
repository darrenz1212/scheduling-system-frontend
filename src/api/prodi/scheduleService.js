import api from '../../axiosConfig.js'

export const fetchJadwal = async (prodi) => {
    try {
        const result = await api.get(`/api/prodi/getjadwal/${prodi}`);
        return result.data;
    } catch (e) {
        console.error(e);
    }
};




export const generateSchedule = async (prodi) => {
    try {
        const result = await api.post('/api/prodi/generate-schedule', { prodi });
        console.log(result);
        return result.data;
    } catch (e) {
        console.log("Error di generateScheduleService:", e);
    }
};


export const addJadwal = async (jadwal) => {
    try {
        const result = await api.post('/api/prodi/addjadwal', jadwal);
        return result.data;
    } catch (e) {
        console.error("Error di addJadwalService: ", e);
    }
}
