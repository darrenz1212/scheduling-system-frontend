import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initialEvents } from "../pages/dosen/initEvent.jsx";
import { availableScheduleService, matkulList , dosenAvailableSchedule} from "../api/AvailableScheduleService.js";
import {fetchMatkulList} from "../redux/matkulSlice.jsx";
import Swal from "sweetalert2";


export const usePickAvailableSchedule = () => {
    const [highlightedEvents, setHighlightedEvents] = useState({});
    const [preferences, setPreferences] = useState({});
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    // const [matkulOptions, setMatkulOptions] = useState([]);
    const [calendarEvents, setCalendarEvents] = useState(initialEvents);
    const [title,setTitle] = useState(" ")

    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const matkulFromStore = useSelector((state) => state.matkul.data);


    console.log("redux : ",user.id)
    console.log("matkul : ", matkulFromStore)

    // setMatkulOptions(matkulFromStore)


    useEffect(() => {
        const fetchData = async () => {
            if (user.id) {
                if (matkulFromStore.length === 0) {
                    dispatch(fetchMatkulList(user.id));
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
                        const foundMatkul = matkulFromStore.find(
                            (m) => m.id === item.matkul_preferensi
                        );

                        const namaMatkul = foundMatkul?.MataKuliah?.nama_matkul || " ";
                        const idMatkul = foundMatkul?.id_matkul || " ";
                        const isPraktikum = foundMatkul?.praktikum ? " (praktikum)" : "";

                        return {
                            id: `${item.id}-${index}`,
                            title: `${idMatkul} ${namaMatkul}${isPraktikum}`,
                            start: `${dayMap[item.hari]}T${item.jam_mulai}`,
                            end: `${dayMap[item.hari]}T${item.jam_akhir}`,
                            color: "bg-green-600",
                        };
                    });

                    setCalendarEvents(mappedEvents);
                    setTitle(`Jadwal ketersediaan mengajar ${user.username}`);
                } else {
                    setCalendarEvents(initialEvents);
                    setTitle("Silahkan pilih jadwal ketersediaan mengajar");
                }
            }
        };

        fetchData();
    }, [user.id, matkulFromStore]);

    const handleEventClick = (info) => {
        info.jsEvent.preventDefault();
        info.jsEvent.stopPropagation();

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
                const selectedEvent = initialEvents.find((event) => event.id === id);
                const dayString = selectedEvent.start.split("T")[0].toLowerCase();

                const formattedData = {
                    dosen: user.id,
                    matkul_preferensi: preferences[id] || null,
                    hari: getDayNumber(dayString),
                    jam_mulai: selectedEvent.start.split("T")[1],
                    jam_akhir: selectedEvent.end ? selectedEvent.end.split("T")[1] : "00:00:00",
                };

                await availableScheduleService(formattedData);
            }

            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Jadwal berhasil ditambahkan!",
                confirmButtonColor: "#10b981",
            }).then(()=>{
                window.location.reload()
            });

            setShowModal(false);
            setHighlightedEvents({});
            setPreferences({});
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Gagal menambahkan jadwal. Silakan coba lagi.",
                confirmButtonColor: "#ef4444",
            });

            console.log(error);
        } finally {
            setLoading(false);
        }
    };


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
        title
    };
};
