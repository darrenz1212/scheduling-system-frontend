import { useEffect, useState } from "react";
import { getJadwalDosen } from "../../api/dosen/JadwalService.js";
import { useSelector } from "react-redux";

export const useJadwalMengajar = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.auth.user);

    const mapHari = (num) => {
        const hariMap = {
            1: "monday",
            2: "tuesday",
            3: "wednesday",
            4: "thursday",
            5: "friday",
            6: "saturday",
            7: "sunday"
        };
        return hariMap[num] || "monday";
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getJadwalDosen(user.id);
                const jadwal = res?.data || [];
                console.log("Hook : ", jadwal)

                const mapped = jadwal.map((item) => ({
                    title: `${item.MatkulAktif?.MataKuliah?.nama_matkul || "Mata Kuliah"}${item.MatkulAktif?.praktikum ? " - Prak" : " - Teori"}`,
                    start: `${mapHari(item.hari)}T${item.jam_mulai}`,
                    end: `${mapHari(item.hari)}T${item.jam_selesai}`,
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

    return { events, loading };
};
