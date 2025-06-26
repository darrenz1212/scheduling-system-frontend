import api from "../../axiosConfig.js"

// export const fetchAllMatkul = async () =>{
//     try {
//         const response = await api.get('/api/prodi/matkul-aktif')
//         return response.data
//     }catch (error) {
//         console.error(error)
//         throw error
//     }
// }

export const fetchMatkulAktif = async (prodi) => {
  try {
      const response = await api.get(`/api/prodi/matkul-aktif/${prodi}`)
      return response.data
  }catch (error){
      console.error(error)
      throw error
  }
}

export const AddMatkul = async (matkulData) => {
    try {
        console.log("KIRIM:", matkulData);
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

export const updateMatkul = async (id, updatedData) => {
    try {
        const response = await api.put(`/api/prodi/matkul-aktif/id/${id}`, updatedData);
        return response.data;
    } catch (error) {
        console.error("Gagal update matkul aktif:", error);
        throw error;
    }
};

export const deleteMatkul = async (id)=>{
    try {
        const response = await api.delete(`/api/prodi/matkul-aktif/${id}`)
        return response
    }catch (error){
        console.error("Gagal menghapus matkul aktif : ", error)
        throw error
    }
}