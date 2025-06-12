import api from '../../axiosConfig.js'

export const fetchJadwal = async () =>{
    try {
        const result = await api.get('/api/prodi/getjadwal')
        return result.data
    }catch (e) {
        console.error(e)
    }
}

