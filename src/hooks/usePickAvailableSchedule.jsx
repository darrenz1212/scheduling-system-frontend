import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initialEvents } from "../pages/dosen/initEvent.jsx";
import {
    addAvailableScheduleService,
    dosenAvailableSchedule,
    updateAvailableSchedule,
} from "../api/AvailableScheduleService.js";
import { fetchMatkulList } from "../redux/matkulSlice.jsx";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import {getJadwalDosen} from "../api/dosen/JadwalService.js";

export const usePickAvailableSchedule = () => {
    const [highlightedEvents, setHighlightedEvents] = useState({});
    const [preferences, setPreferences] = useState({});
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [calendarEvents, setCalendarEvents] = useState(initialEvents);
    const [title, setTitle] = useState(" ");
    const [showMatkulModal, setShowMatkulModal] = useState(false);
    const [isGenerated, setIsGenerated] = useState(false);

    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const matkulFromStore = useSelector((state) => state.matkul.data);
    const prodi = user.prodi;

    useEffect(() => {
        const fetchData = async () => {
            if (!user.id) return;
            if (matkulFromStore.length === 0) {
                dispatch(fetchMatkulList(user.id));
                return;
            }

            const existingSchedules = await dosenAvailableSchedule(user.id);

            if (existingSchedules && existingSchedules.length > 0) {
                const dayMap = {
                    1: "monday",
                    2: "tuesday",
                    3: "wednesday",
                    4: "thursday",
                    5: "friday",
                    6: "saturday",
                    7: "sunday",
                };

                const mappedEvents = existingSchedules.map((item, index) => {
                    const foundMatkul = matkulFromStore.find((m) => m.id === item.matkul_preferensi);
                    const namaMatkul = foundMatkul?.MataKuliah?.nama_matkul || " ";
                    const idMatkul = foundMatkul?.id_matkul || " ";
                    const isPraktikum = foundMatkul?.praktikum ? " (praktikum)" : "";

                    return {
                        id: `${item.id}-${index}`,
                        scheduleId: item.id,
                        title: `${idMatkul} ${namaMatkul}${isPraktikum}`,
                        start: `${dayMap[item.hari]}T${item.jam_mulai}`,
                        end: `${dayMap[item.hari]}T${item.jam_akhir}`,
                        color: "bg-green-600",
                        prodi: item.prodi,
                    };
                });

                setCalendarEvents(mappedEvents);
                setTitle(`Jadwal ketersediaan mengajar ${user.username}`);
            } else {
                setCalendarEvents(initialEvents);
                setTitle("Silahkan pilih jadwal ketersediaan mengajar");
            }
        };

        fetchData();
    }, [user.id, matkulFromStore]);

    const handleEventClick = (info) => {
        setHighlightedEvents((prev) => {
            const newEvents = { ...prev };
            if (newEvents[info.event.id]) {
                delete newEvents[info.event.id];
            } else {
                newEvents[info.event.id] = true;
            }
            return newEvents;
        });
    };

    const eventClassNames = ({ event }) => {
        return highlightedEvents[event.id] ? "bg-green-500 text-white" : event.extendedProps.color;
    };

    const handleInputChange = (id, value) => {
        setPreferences((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleNextClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const toggleMatkulModal = () => {
        setShowMatkulModal((prev) => !prev);
    };

    const getDayNumber = (dayString) => {
        const daysMapping = {
            monday: 1,
            tuesday: 2,
            wednesday: 3,
            thursday: 4,
            friday: 5,
        };
        return daysMapping[dayString.toLowerCase()] || 0;
    };

    const formatScheduleLabel = (event) => {
        const dayMap = {
            monday: "Senin",
            tuesday: "Selasa",
            wednesday: "Rabu",
            thursday: "Kamis",
            friday: "Jumat",
            saturday: "Sabtu",
            sunday: "Minggu",
        };

        const dayPart = event.start.split("T")[0].toLowerCase();
        const timePartStart = event.start.split("T")[1].slice(0, 5);
        const timePartEnd = event.end ? event.end.split("T")[1].slice(0, 5) : "??:??";
        const dayName = dayMap[dayPart] || dayPart;

        return `${dayName} ${timePartStart} - ${timePartEnd}`;
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const selectedSchedules = Object.keys(highlightedEvents).filter((id) => highlightedEvents[id]);

            for (const id of selectedSchedules) {
                const selectedEvent = calendarEvents.find((event) => event.id === id);

                if (selectedEvent?.scheduleId) {
                    await updateAvailableSchedule(selectedEvent.scheduleId, {
                        prodi: selectedEvent.prodi === user.prodi ? null : user.prodi,
                    });
                } else {
                    const dayString = selectedEvent.start.split("T")[0].toLowerCase();
                    const selectedMatkul = matkulFromStore.find((m) => m.id === preferences[id]);
                    console.log("Selected Matkul : ",matkulFromStore)
                    const formattedData = {
                        dosen: user.id,
                        matkul_preferensi: preferences[id] || null,
                        hari: getDayNumber(dayString),
                        jam_mulai: selectedEvent.start.split("T")[1],
                        jam_akhir: selectedEvent.end ? selectedEvent.end.split("T")[1] : "00:00:00",
                        prodi: selectedMatkul?.prodi || prodi,
                    };

                    await addAvailableScheduleService(formattedData);
                }
            }

            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Jadwal berhasil diperbarui!",
                confirmButtonColor: "#10b981",
            }).then(() => {
                window.location.reload();
            });

            setShowModal(false);
            setHighlightedEvents({});
            setPreferences({});
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Gagal memperbarui jadwal. Silakan coba lagi.",
                confirmButtonColor: "#ef4444",
            });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const hasMatkulAssigned = matkulFromStore.length > 0;

    const totalNeededMinutes = matkulFromStore.reduce((acc, item) => {
        const sksMenit = item.praktikum ? item.sks * 120 : item.sks * 50;
        return acc + sksMenit;
    }, 0);

    const totalSelectedMinutes = Object.keys(highlightedEvents).reduce((acc, id) => {
        const event = calendarEvents.find((e) => e.id === id);
        if (!event) return acc;
        const start = dayjs(`2020-01-01T${event.start.split("T")[1]}`);
        const end = dayjs(`2020-01-01T${event.end.split("T")[1]}`);
        return acc + end.diff(start, "minute");
    }, 0);

    const remainingMinutes = Math.max(totalNeededMinutes - totalSelectedMinutes, 0);



    useEffect(() => {
        const checkSchedule = async () => {
            if (!user || !user.id) return;

            try {
                const schedule = await getJadwalDosen(user.id);

                if (schedule.data.length === 0) {
                    setIsGenerated(false);
                } else {
                    setIsGenerated(true);
                }
            } catch (error) {
                console.error("Gagal fetch jadwal dosen:", error);
                setIsGenerated(false)
            }
        };

        checkSchedule();
    }, [user?.id]);

    console.log(isGenerated)

    // setIsGenerated(true);
    // console.log("isGenerated di-set jadi true");
    // useEffect(() => {
    //     console.log("Perubahan isGenerated:", isGenerated);
    // }, [isGenerated]);




    // ============= edit section =============

    // const handleScheduleModalSave = (upd) => {
    //     setEditedEvents(prev => ({ ...prev, [upd.id]: upd }));
    //     closeScheduleModal();
    // };
    //
    // const getBusyEvents = (hari) =>
    //     jadwal.filter(j => j.hari === hari);
    //
    // const getRuanganList = () => {
    //     return Array.from(new Map(jadwal.map(j => [j.ruangan_id, j.Ruangan])).values());
    // };


    return {
        highlightedEvents,
        handleEventClick,
        eventClassNames,
        initialEvents: calendarEvents,
        showModal,
        handleNextClick,
        handleCloseModal,
        preferences,
        handleInputChange,
        handleSubmit,
        loading,
        formatScheduleLabel,
        matkulOptions: matkulFromStore,
        title,
        hasMatkulAssigned,
        remainingMinutes,
        showMatkulModal,
        toggleMatkulModal,
        matkulAssigned: matkulFromStore,
        totalSelectedMinutes,
        isGenerated
    };
};
