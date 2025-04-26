import { useEffect, useState } from "react";
import { fetchJadwal, generateSchedule, addJadwal } from "../../api/prodi/scheduleService.js";
// import {fetchActivePeriod} from"../../api/periodeService.js"
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

export const useScheduleSystem = (customEventClick = null) => {
    const user = useSelector((state) => state.auth.user);
    const [jadwal, setJadwal] = useState([]);
    const [semesterOptions, setSemesterOptions] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState("1");
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [isEmpty, setIsEmpty] = useState(false);

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

    const fetchData = async () => {
        try {
            setLoading(true);
            console.log(user.prodi);
            const res = await fetchJadwal(user.prodi); // ⬅️ user.prodi dikirim benar ke params
            console.log(res);
            const data = (res?.data || []).filter(item =>
                item?.MatkulAktif?.MataKuliah?.semester
            );

            setJadwal(data);

            if (data.length === 0) {
                setIsEmpty(true);
            } else {
                setIsEmpty(false);
                const semesters = Array.from(
                    new Set(data.map(d => d.MatkulAktif.MataKuliah.semester))
                );
                setSemesterOptions(semesters.sort((a, b) => parseInt(a) - parseInt(b)));
            }

            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch jadwal:", error);
            setLoading(false);
        }
    };


    const generateAndAddSchedule = async () => {
        const confirm = await Swal.fire({
            title: "Generate Jadwal Baru?",
            text: "Proses ini akan membuat jadwal otomatis. Lanjutkan?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0db0bb",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, Generate",
            cancelButtonText: "Batal"
        });

        if (confirm.isConfirmed) {
            try {
                Swal.fire({
                    title: "Sedang memproses...",
                    html: "Generate jadwal mungkin memerlukan beberapa detik. Mohon tunggu.",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                const generated = await generateSchedule(user.prodi);
                if (!generated || !generated.data) throw new Error("Gagal generate jadwal");
                console.log(generated.data)
                const added = await addJadwal(generated);
                if (!added) throw new Error("Gagal menambahkan jadwal");


                Swal.fire({
                    title: "Berhasil!",
                    text: "Jadwal berhasil digenerate dan disimpan.",
                    icon: "success",
                    confirmButtonColor: '#0db0bb'
                });

                fetchData(); // ⬅️ Reload data setelah sukses
            } catch (error) {
                console.error("Error saat generate dan tambah jadwal", error);
                // 🔥 Kalau error
                Swal.fire({
                    title: "Gagal!",
                    text: error.message || "Terjadi kesalahan saat generate jadwal.",
                    icon: "error",
                    confirmButtonColor: '#0db0bb'
                });
            }
        }
    };


    useEffect(() => {
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
        handleEventClick,
        isEmpty,
        generateAndAddSchedule
    };
};
