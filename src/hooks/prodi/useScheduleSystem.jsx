import { useEffect, useState } from "react";
import { fetchJadwal } from "../../api/prodi/prodiService.js";
import Swal from "sweetalert2";

export const useScheduleSystem = (customEventClick = null) => {
    const [jadwal, setJadwal] = useState([]);
    const [semesterOptions, setSemesterOptions] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState("1");
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);

    const handleEventClick = (info) => {
        if (typeof customEventClick === "function") {
            customEventClick(info);
            return;
        }

        const data = info.event.extendedProps.meta;
        const isPrak = data?.MatkulAktif?.praktikum;
        const jenis = isPrak ? "Praktikum" : "Teori";
        const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

        Swal.fire({
            title: `${data?.MatkulAktif?.id_matkul} ${data?.MatkulAktif.MataKuliah.nama_matkul} - ${data?.MatkulAktif?.kelas}`,
            html: `
                <b>Dosen:</b> ${data?.MatkulAktif?.User.username}<br/>
                <b>Jenis:</b> ${jenis}<br/>
                <b>Hari:</b> ${hari[data?.hari]}<br/>
                <b>Waktu:</b> ${data?.jam_mulai} - ${data?.jam_selesai}<br/>
                <b>Ruangan:</b> ${data?.Ruangan.nama_ruangan}
            `,
            icon: 'info',
            confirmButtonColor: '#0db0bb'
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetchJadwal();
                const data = (res?.data || []).filter(item =>
                    item?.MatkulAktif?.MataKuliah?.semester
                );

                setJadwal(data);

                const semesters = Array.from(
                    new Set(data.map(d => d.MatkulAktif.MataKuliah.semester))
                );
                setSemesterOptions(semesters.sort((a, b) => parseInt(a) - parseInt(b)));
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch jadwal:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const filtered = selectedSemester === "all"
            ? jadwal
            : jadwal.filter(j =>
                j?.MatkulAktif?.MataKuliah?.semester === selectedSemester
            );

        const mapped = filtered.map((j) => {
            const dayNum = j?.hari;
            const start = j?.jam_mulai;
            const end = j?.jam_selesai;
            const isPrak = j?.MatkulAktif?.praktikum;
            const label = isPrak ? " - Praktikum" : " - Teori";

            const dayMap = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
            const dayName = dayMap[dayNum];

            return {
                id: j?.id_jadwal_kuliah?.toString(),
                title: `${j?.MatkulAktif?.id_matkul} - ${j?.MatkulAktif?.kelas}${label}`,
                start: `${dayName}T${start}`,
                end: `${dayName}T${end}`,
                meta: j
            };
        }).filter(Boolean);

        setEvents(mapped);
    }, [selectedSemester, jadwal]);

    return {
        events,
        semesterOptions,
        selectedSemester,
        setSelectedSemester,
        loading,
        handleEventClick // auto-include built-in or custom click handler
    };
};
