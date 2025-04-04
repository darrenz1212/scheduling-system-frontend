import api from "../axiosConfig.js"

export const fetchAllPeriode = async () => {
  try {
      const response = await api.get('/api/prodi/periode')
      return response.data
  }catch (error){
      console.error(error)
      throw error
  }
}

