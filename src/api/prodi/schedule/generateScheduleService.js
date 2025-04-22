import api from '../../../axiosConfig.js'


export const generateSchedule = async (prodi) =>{
    try {
        const result = await api.post('/api/prodi/generate-schedule',prodi)
        console.log(result)
        return result.data
    }catch (e) {
        console.log("Error di generateScheduleService : ", e)
    }
}