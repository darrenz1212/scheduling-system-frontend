import api from "../axiosConfig.js"

export const fetchMatkulAktifThisPeriod = async ()=>{
    try {
        const result = await api.get("/api/prodi/matkul-aktif")
        return result
    }catch (e) {
        console.error(e)
        throw e
    }
}