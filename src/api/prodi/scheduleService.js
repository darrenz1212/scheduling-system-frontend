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

export const updateJadwal = async (updateData) => {
    const response = await api.put(`/api/prodi/jadwal`, { data: updateData });
    return response.data;
};

export const fetchJadwalDosen = async (dosenId) => {
    try {
        const response = await api.get(`/api/prodi/jadwaldosen/${dosenId}`)
        // response.data === { result: [...] }
        return Array.isArray(response.data.result)
            ? response.data.result
            : []
    } catch (e) {
        console.error("Error di fetchJadwalDosen:", e)
        return []
    }
}

export const fetchRuanganList = async (prodi) => {
    try {
        const res = await api.get(`/api/prodi/ruangan/${prodi}`)
        return res.data.data ?? []
    } catch (e) {
        console.error("Error fetch ruangan:", e)
        return []
    }
}

