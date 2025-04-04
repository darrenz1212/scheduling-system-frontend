import api from "../../axiosConfig.js"

export const fetchAllMatkul = async () =>{
    try {
        const response = await api.get('/api/prodi/matkul-aktif')
        return response.data
    }catch (error) {
        console.error(error)
        throw error
    }
}

export const fetchMatkulByPeriod = async (periode) => {
  try {
      const response = await api.get(`/api/prodi/matkul-aktif/${periode}`)
      return response.data
  }catch (error){
      console.error(error)
      throw error
  }
}

export const AddMatkul = async (matkulData) => {
    try {
        const response = await api.post("/api/prodi/matkul-aktif", matkulData);
        return response.data;
    } catch (error) {
        console.error("Gagal menambahkan matkul aktif:", error);
        throw error;
    }
};

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