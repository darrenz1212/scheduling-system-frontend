import { useEffect, useState } from "react";
import { getJadwalDosen } from "../../api/dosen/JadwalService.js";
import { useSelector } from "react-redux";

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

    return { events, loading };
};
