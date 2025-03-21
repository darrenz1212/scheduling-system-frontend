import { useState, useEffect } from "react";
import { useSelector } from "react-redux"; // Import Redux hook
import { initialEvents } from "../pages/dosen/initEvent.jsx";
import { availableScheduleService, matkulList } from "../api/AvailableScheduleService.js";

export const usePickAvailableSchedule = () => {
    const [highlightedEvents, setHighlightedEvents] = useState({});
    const [preferences, setPreferences] = useState({});
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [matkulOptions, setMatkulOptions] = useState([]);

    const user = useSelector((state) => state.auth.user);

    console.log("redux : ",user.id)

    useEffect(() => {
        if (user.id) {
            const fetchMatkul = async () => {
                const matkulData = await matkulList(user.id);
                setMatkulOptions(matkulData);
            };
            fetchMatkul();
        }
    }, [user.id]);

    console.log(matkulOptions)
    const handleEventClick = (info) => {
        info.jsEvent.preventDefault();
        info.jsEvent.stopPropagation();
        setHighlightedEvents((prev) => ({
            ...prev,
            [info.event.id]: !prev[info.event.id],
        }));
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

    console.log("selected event : ", preferences)
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

                console.log("📌 Sending data:", formattedData);
                await availableScheduleService(formattedData);
            }

            alert("✅ Jadwal berhasil ditambahkan!");
            setShowModal(false);
            setHighlightedEvents({});
            setPreferences({});
        } catch (error) {
            alert("❌ Gagal menambahkan jadwal. Silakan coba lagi.");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };


    return {
        highlightedEvents,
        handleEventClick,
        eventClassNames,
        initialEvents,
        showModal,
        handleNextClick,
        handleCloseModal,
        preferences,
        handleInputChange,
        handleSubmit,
        loading,
        formatScheduleLabel,
        matkulOptions,
    };
};
