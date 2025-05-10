import { useEffect, useState, useMemo } from "react";
import {
    fetchJadwal,
    generateSchedule,
    addJadwal,
    updateJadwal
} from "../../api/prodi/scheduleService.js";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

export const useScheduleSystem = (customEventClick = null) => {
    const user = useSelector((state) => state.auth.user);
    const [jadwal, setJadwal] = useState([]);
    const [semesterOptions, setSemesterOptions] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState("all");
    const [selectedMatkul, setSelectedMatkul] = useState("all");
    const [selectedDosen, setSelectedDosen] = useState("all");
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [isEmpty, setIsEmpty] = useState(false);
    const [editedEvents, setEditedEvents] = useState({});
    const [roomModal, setRoomModal] = useState({ open: false, data: null });

    const openRoomModal = (meta) => setRoomModal({ open: true, data: meta });
    const closeRoomModal = () => setRoomModal({ open: false, data: null });

    const matkulList = useMemo(() => {
        const list = jadwal.map(j => ({
            id: j.MatkulAktif.id_matkul,
            nama: j.MatkulAktif.MataKuliah.nama_matkul
        }));
        const unique = Array.from(new Map(list.map(item => [item.id, item])).values());
        return unique;
    }, [jadwal]);

    const dosenList = useMemo(() => {
        const list = jadwal.map(j => ({
            id: j.MatkulAktif.dosen,
            nama: j.MatkulAktif.User.username,
        }));
        const unique = Array.from(new Map(list.map(item => [item.id, item])).values());
        return unique;
    }, [jadwal]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetchJadwal(user.prodi);
            const data = (res.data || []).filter(item =>
                item?.MatkulAktif?.MataKuliah?.semester
            );
            setJadwal(data);
            setIsEmpty(data.length === 0);

            if (data.length > 0) {
                const semesters = Array.from(new Set(
                    data.map(d => d.MatkulAktif.MataKuliah.semester)
                ));
                setSemesterOptions(semesters.sort((a, b) => parseInt(a) - parseInt(b)));
                setSelectedSemester(semesters[0]);
            }
        } catch (error) {
            console.error("Failed to fetch jadwal:", error);
        } finally {
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
        if (!confirm.isConfirmed) return;

        try {
            Swal.fire({
                title: "Sedang memproses...",
                html: "Mohon tunggu.",
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => Swal.showLoading()
            });
            const generated = await generateSchedule(user.prodi);
            const added = await addJadwal(generated);
            Swal.close();
            Swal.fire({
                title: "Berhasil!",
                text: "Jadwal berhasil digenerate dan disimpan.",
                icon: "success",
                confirmButtonColor: "#0db0bb"
            });
            fetchData();
        } catch (error) {
            Swal.fire({
                title: "Gagal!",
                text: error.message || "Terjadi kesalahan.",
                icon: "error",
                confirmButtonColor: "#0db0bb"
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const filtered = jadwal.filter(j => {
            const semesterMatch = selectedSemester === "all" || j.MatkulAktif.MataKuliah.semester === selectedSemester;
            const matkulMatch = selectedMatkul === "all" || j.MatkulAktif.id_matkul === selectedMatkul;
            const dosenMatch = selectedDosen === "all" || j.MatkulAktif.dosen === selectedDosen;
            return semesterMatch && matkulMatch && dosenMatch;
        });

        const dayMap = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
        const mapped = filtered.map(j => {
            const dayName = dayMap[j.hari];
            const label = j.MatkulAktif.praktikum ? " - Praktikum" : " - Teori";
            return {
                id: j.id_jadwal_kuliah.toString(),
                title: `${j.MatkulAktif.id_matkul} - ${j.MatkulAktif.kelas}${label}`,
                start: `${dayName}T${j.jam_mulai}`,
                end:   `${dayName}T${j.jam_selesai}`,
                meta:  j
            };
        });
        setEvents(mapped);
    }, [selectedSemester, selectedMatkul, selectedDosen, jadwal]);


    const handleEventClick = info => {
        if (typeof customEventClick === "function") {
            customEventClick(info);
            return;
        }
        const data = info.event.extendedProps.meta;
        const isPrak = data.MatkulAktif.praktikum;
        const jenis  = isPrak ? "Praktikum" : "Teori";
        const hariArr= ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
        Swal.fire({
            title: `${data.MatkulAktif.id_matkul} ${data.MatkulAktif.MataKuliah.nama_matkul} - ${data.MatkulAktif.kelas}`,
            html: `
                <b>Dosen:</b> ${data.MatkulAktif.User.username}<br/>
                <b>Jenis:</b> ${jenis}<br/>
                <b>Hari:</b> ${hariArr[data.hari]}<br/>
                <b>Waktu:</b> ${data.jam_mulai} - ${data.jam_selesai}<br/>
                <b>Ruangan:</b> ${data.Ruangan.nama_ruangan}
            `,
            showCancelButton: true,
            confirmButtonText: "Ubah Ruangan",
            cancelButtonText: "Tutup",
            confirmButtonColor: "#0db0bb"
        }).then(result => {
            if (result.isConfirmed) openRoomModal(data);
        });
    };

    const handleEventDrop = info => {
        const meta = info.event.extendedProps.meta;
        const id = meta.id_jadwal_kuliah;
        const d = info.event.start;
        const hari = d.getDay();
        const jam_mulai = d.toTimeString().slice(0,8);
        const jam_selesai = info.event.end.toTimeString().slice(0,8);
        setEditedEvents(prev => ({
            ...prev,
            [id]: {
                hari,
                jam_mulai,
                jam_selesai,
                ruangan_id: meta.ruangan_id
            }
        }));
    };

    const handleEventResize = handleEventDrop;
    const hasEdits = Object.keys(editedEvents).length > 0;

    const saveChanges = async () => {
        if (!hasEdits) return;
        const updates = Object.entries(editedEvents).map(([id,upd]) => ({
            id, ...upd
        }));
        try {
            await updateJadwal(updates);
            Swal.fire({ icon:"success", title:"Perubahan tersimpan", confirmButtonColor:"#0db0bb" });
            setEditedEvents({});
            fetchData();
        } catch (err) {
            Swal.fire({ icon:"error", title:"Gagal simpan", text: err.message });
        }
    };


    const filterOptions = useMemo(() => [
        { label: "Semua", value: "all", type: "all" },
        ...semesterOptions.map((s) => ({ label: `Semester ${s}`, value: s, type: "semester" })),
        ...matkulList.map((m) => ({ label: `Matkul - ${m.nama}`, value: m.id, type: "matkul" })),
        ...dosenList.map((d) => ({ label: `Dosen - ${d.nama}`, value: d.id, type: "dosen" })),
    ], [semesterOptions, matkulList, dosenList]);


    const handleFilterChange = (option) => {
        if (!option) return;
        setSelectedSemester("all");
        setSelectedMatkul("all");
        setSelectedDosen("all");

        if (option.type === "semester") {
            setSelectedSemester(option.value);
        } else if (option.type === "matkul") {
            setSelectedMatkul(option.value);
        } else if (option.type === "dosen") {
            setSelectedDosen(option.value);
        }
    };



    return {
        events,
        semesterOptions,
        selectedSemester,
        setSelectedSemester,
        selectedMatkul,
        setSelectedMatkul,
        matkulList,
        loading,
        handleEventClick,
        handleEventDrop,
        handleEventResize,
        isEmpty,
        generateAndAddSchedule,
        saveChanges,
        hasEdits,
        roomModal,
        closeRoomModal,
        filterOptions,
        handleFilterChange,

    };
};
