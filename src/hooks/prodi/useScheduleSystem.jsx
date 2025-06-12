import { useEffect, useState, useMemo } from "react";
import {
    fetchJadwal,
    generateSchedule,
    addJadwal,
    updateJadwal,
    fetchJadwalDosen,
    clearJadwal
} from "../../api/prodi/scheduleService.js";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

export const useScheduleSystem = (customEventClick = null) => {
    const user = useSelector((state) => state.auth.user);

    const [jadwal, setJadwal] = useState([]);
    const [availability, setAvailability] = useState([]);
    const [semesterOptions, setSemesterOptions] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState("all");
    const [selectedMatkul, setSelectedMatkul] = useState("all");
    const [selectedDosen, setSelectedDosen] = useState("all");
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [isEmpty, setIsEmpty] = useState(false);
    const [editedEvents, setEditedEvents] = useState({});
    const [roomModal, setRoomModal] = useState({ open: false, data: null });
    const [scheduleModal, setScheduleModal] = useState({ open: false, data: null });

    const openRoomModal = (meta) => setRoomModal({ open: true, data: meta });
    const closeRoomModal = () => setRoomModal({ open: false, data: null });

    const openScheduleModal = (meta) => setScheduleModal({ open: true, data: meta });
    const closeScheduleModal = () => setScheduleModal({ open: false, data: null });

    const matkulList = useMemo(() => {
        const list = jadwal.map((j) => ({
            id: j.MatkulAktif.id_matkul,
            nama: j.MatkulAktif.MataKuliah.nama_matkul,
        }));
        return Array.from(new Map(list.map((i) => [i.id, i])).values());
    }, [jadwal]);

    const dosenList = useMemo(() => {
        const list = jadwal.map((j) => ({
            id: j.MatkulAktif.dosen,
            nama: j.MatkulAktif.User.username,
        }));
        return Array.from(new Map(list.map((i) => [i.id, i])).values());
    }, [jadwal]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetchJadwal(user.prodi);
            const data = (res.data || []).filter(
                (item) => item?.MatkulAktif?.MataKuliah?.semester
            );
            setJadwal(data);
            setIsEmpty(data.length === 0);

            if (data.length > 0) {
                const semesters = Array.from(
                    new Set(data.map((d) => d.MatkulAktif.MataKuliah.semester))
                );
                setSemesterOptions(semesters.sort((a, b) => parseInt(a) - parseInt(b)));
                setSelectedSemester(semesters[0]);

                const dosenId = data[0].MatkulAktif.dosen;
                const availRes = await fetchJadwalDosen(dosenId);
                setAvailability(availRes);
            }
        } catch (error) {
            console.error("Failed to fetch jadwal:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (scheduleModal.open && scheduleModal.data?.MatkulAktif?.dosen) {
            const dosenId = scheduleModal.data.MatkulAktif.dosen;
            fetchJadwalDosen(dosenId)
                .then(setAvailability)
                .catch(err =>
                    console.error("Failed to fetch jadwal dosen:", err)
                );
        }
    }, [scheduleModal.open, scheduleModal.data?.MatkulAktif?.dosen]);

    const availabilityRanges = useMemo(() => {
        if (!Array.isArray(availability)) return []
        return availability.map(slot => ({
            daysOfWeek: [slot.hari],
            startTime: slot.jam_mulai,
            endTime:   slot.jam_akhir,
        }))
    }, [availability]);

    useEffect(() => {
        const filtered = jadwal.filter(j => {
            const semMatch = selectedSemester === "all" || j.MatkulAktif.MataKuliah.semester === selectedSemester;
            const matMatch = selectedMatkul === "all" || j.MatkulAktif.id_matkul === selectedMatkul;
            const dosMatch = selectedDosen === "all" || j.MatkulAktif.dosen === selectedDosen;
            return semMatch && matMatch && dosMatch;
        });

        const dayMap = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
        const mapped = filtered.map(j => ({
            id:    j.id_jadwal_kuliah.toString(),
            title: `${j.MatkulAktif.id_matkul} - ${j.MatkulAktif.kelas}` +
                (j.MatkulAktif.praktikum ? " - Praktikum" : " - Teori"),
            start: `${dayMap[j.hari]}T${j.jam_mulai}`,
            end:   `${dayMap[j.hari]}T${j.jam_selesai}`,
            meta:  j
        }));
        setEvents(mapped);
    }, [jadwal, selectedSemester, selectedMatkul, selectedDosen]);

    const isWithinAvailability = (hari, jm, js) =>
        availability.some(slot =>
            slot.hari === hari &&
            jm >= slot.jam_mulai &&
            js <= slot.jam_akhir
        );

    const handleEventClick = (info) => {
        if (typeof customEventClick === "function") {
            customEventClick(info);
            return;
        }
        const data = info.event.extendedProps.meta;
        Swal.fire({
            title: `${data.MatkulAktif.id_matkul} ${data.MatkulAktif.MataKuliah.nama_matkul}`,
            html:
                `<b>Dosen:</b> ${data.MatkulAktif.User.username}<br/>` +
                `<b>Hari:</b> ${["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"][data.hari]}<br/>` +
                `<b>Waktu:</b> ${data.jam_mulai} - ${data.jam_selesai}<br/>` +
                `<b>Ruangan:</b> ${data.Ruangan.nama_ruangan}`,
            showCancelButton: true,
            confirmButtonText: "Edit Jadwal",
            cancelButtonText: "Tutup",
            confirmButtonColor: "#0db0bb",
        }).then((result) => {
            if (result.isConfirmed) {
                openScheduleModal(data);
            }
        });
    };

    const handleEventDrop = (info) => {
        const meta = info.event.extendedProps.meta;
        const id = meta.id_jadwal_kuliah;
        const d = info.event.start;
        const hari = d.getDay();
        const jam_mulai = d.toTimeString().slice(0, 8);
        const jam_selesai = info.event.end.toTimeString().slice(0, 8);

        if (!isWithinAvailability(hari, jam_mulai, jam_selesai)) {
            Swal.fire({
                title: "Diluar ketersediaan",
                text: "Dosen mungkin tidak bersedia di jadwal ini. Lanjutkan?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Ya, lanjutkan",
                cancelButtonText: "Batal",
                confirmButtonColor: "#0db0bb",
                cancelButtonColor: "#d33",
            }).then((result) => {
                if (result.isConfirmed) {
                    setEditedEvents((prev) => ({
                        ...prev,
                        [id]: {
                            hari,
                            jam_mulai,
                            jam_selesai,
                            ruangan_id: meta.ruangan_id,
                        },
                    }));
                } else {
                    info.revert();
                }
            });
            return;
        }

        setEditedEvents((prev) => ({
            ...prev,
            [id]: { hari, jam_mulai, jam_selesai, ruangan_id: meta.ruangan_id },
        }));
    };

    const handleEventResize = handleEventDrop;

    const hasEdits = Object.keys(editedEvents).length > 0;

    const saveChanges = async () => {
        if (!hasEdits) return;
        const updates = Object.entries(editedEvents).map(([id, upd]) => ({ id, ...upd }));
        try {
            await updateJadwal(updates);
            Swal.fire({
                icon: "success",
                title: "Perubahan tersimpan",
                confirmButtonColor: "#0db0bb",
            });
            setEditedEvents({});
            fetchData();
        } catch (err) {
            Swal.fire({ icon: "error", title: "Gagal simpan", text: err.message });
        }
    };

    const filterOptions = useMemo(() => [
        { label: "Semua", value: "all", type: "all" },
        ...semesterOptions.map(s => ({ label: `Semester ${s}`, value: s, type: "semester" })),
        ...matkulList.map(m => ({ label: `Matkul - ${m.nama}`, value: m.id, type: "matkul" })),
        ...dosenList.map(d => ({ label: `Dosen - ${d.nama}`, value: d.id, type: "dosen" })),
    ], [semesterOptions, matkulList, dosenList]);

    const handleFilterChange = (option) => {
        if (!option) return;
        setSelectedSemester("all");
        setSelectedMatkul("all");
        setSelectedDosen("all");

        if (option.type === "semester") setSelectedSemester(option.value);
        if (option.type === "matkul") setSelectedMatkul(option.value);
        if (option.type === "dosen") setSelectedDosen(option.value);
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
            cancelButtonText: "Batal",
        });
        if (!confirm.isConfirmed) return;

        try {
            Swal.fire({
                title: "Sedang memproses...",
                html: "Mohon tunggu.",
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => Swal.showLoading(),
            });
            const generated = await generateSchedule(user.prodi);
            await addJadwal(generated);
            Swal.close();
            Swal.fire({
                title: "Berhasil!",
                text: "Jadwal berhasil digenerate dan disimpan.",
                icon: "success",
                confirmButtonColor: "#0db0bb",
            });
            fetchData();
        } catch (error) {
            Swal.fire({
                title: "Gagal!",
                text: error.message || "Terjadi kesalahan.",
                icon: "error",
                confirmButtonColor: "#0db0bb",
            });
        }
    };

    const clearJadwalAll = async () => {
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
        if (!confirm.isConfirmed) return;

        try {
            await clearJadwal(user.prodi);
            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Semua jadwal telah dihapus.",
                confirmButtonColor: "#0db0bb",
            });
            fetchData();
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Terjadi kesalahan dalah menghapus jadwal",
            });
        }
    };


    // ============= edit section =============
    const handleScheduleModalSave = (upd) => {
        const { id_jadwal_kuliah, ...changes } = upd;
        // track updates to be persisted
        setEditedEvents(prev => ({ ...prev, [id_jadwal_kuliah]: changes }));

        // immediately reflect the change in the calendar
        const dayMap = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
        ];
        setEvents(prev =>
            prev.map(ev =>
                ev.id === id_jadwal_kuliah.toString()
                    ? {
                        ...ev,
                        start: `${dayMap[changes.hari]}T${changes.jam_mulai}`,
                        end: `${dayMap[changes.hari]}T${changes.jam_selesai}`,
                        meta: { ...ev.meta, ...changes },
                    }
                    : ev
            )
        );
        closeScheduleModal();
    };

    const getBusyEvents = (hari) =>
        jadwal.filter(j => j.hari === hari);

    const getRuanganList = () => {
        return Array.from(new Map(jadwal.map(j => [j.ruangan_id, j.Ruangan])).values());
    };

    return {
        events,
        availabilityRanges,
        semesterOptions,
        selectedSemester,
        setSelectedSemester,
        selectedMatkul,
        setSelectedMatkul,
        selectedDosen,
        setSelectedDosen,
        matkulList,
        loading,
        isEmpty,
        hasEdits,
        filterOptions,
        handleFilterChange,
        handleEventClick,
        handleEventDrop,
        handleEventResize,
        roomModal,
        openRoomModal,
        closeRoomModal,
        scheduleModal,
        openScheduleModal,
        closeScheduleModal,
        saveChanges,
        generateAndAddSchedule,
        handleScheduleModalSave,
        getBusyEvents,
        getRuanganList,
        clearJadwalAll,
    };
};
