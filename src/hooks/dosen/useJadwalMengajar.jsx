import { useEffect, useState } from "react";
import { getJadwalDosen, clearJadwal } from "../../api/dosen/JadwalService.js";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";


export const useJadwalMengajar = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getJadwalDosen(user.id);
                const jadwal = res?.data || [];

                const dayMap = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

                const mapped = jadwal.map(j => ({
                    id:    j.id_jadwal_kuliah.toString(),
                    title: `${j.MatkulAktif?.id_matkul} - ${j.MatkulAktif?.kelas}` +
                        (j.MatkulAktif?.praktikum ? " - Praktikum" : " - Teori"),
                    start: `${dayMap[j.hari]}T${j.jam_mulai}`,
                    end:   `${dayMap[j.hari]}T${j.jam_selesai}`,
                    meta:  j
                }));

                setEvents(mapped);
            } catch (err) {
                console.error("Hook error:", err);
                setEvents([]);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) fetchData();
    }, [user?.id]);

    const clearJadwal = async () =>{
        const confirm = await Swal.fire({
            title: "Hapus semua jadwal?",
            text: "Seluruh jadwal pada periode ini akan dihapus.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#f23b2e",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Ya, hapus",
            cancelButtonText: "Batal",
        });
        if (!confirm.isConfirmed) return
        try {
            await clearJadwal(user.id);
            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Semua jadwal telah dihapus.",
                confirmButtonColor: "#0db0bb",
            });
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Terjadi kesalahan dalah menghapus jadwal",
            });
        }
    }

    return {
        events,
        loading,
        clearJadwal
    };


};
