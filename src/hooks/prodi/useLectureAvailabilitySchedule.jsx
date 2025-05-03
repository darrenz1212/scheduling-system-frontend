import { useEffect, useState } from "react";
import {
    fetchAllAvailableSchedule,
    fetchDosenList,
    editAlokasiProdi
} from "../../api/AvailableScheduleService";
import Swal from "sweetalert2";
import {useSelector} from "react-redux";

const dayMap = {
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday"
};

const dayReverseMap = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5
};


export const useLectureAvailabilitySchedule = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dosenList, setDosenList] = useState([]);
    const [selectedDosen, setSelectedDosen] = useState("all");
    const [editingEvent, setEditingEvent] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const user = useSelector((state) => state.auth.user);

    const prodi = user.prodi

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [scheduleData, dosenData] = await Promise.all([
                    fetchAllAvailableSchedule(),
                    fetchDosenList()
                ]);

                setDosenList(dosenData);

                const mapped = scheduleData.result.map((item) => {
                    const { id_matkul, kelas, praktikum } = item.MatkulAktif || {};
                    const praktikumSuffix = praktikum ? "(P)" : "";
                    const title = `${item.dosen} - ${id_matkul || ""} - ${kelas || ""} ${praktikumSuffix}`.trim();

                    return {
                        id: item.id.toString(),
                        title,
                        dosenId: item.dosen,
                        start: `${dayMap[item.hari]}T${item.jam_mulai}`,
                        end: `${dayMap[item.hari]}T${item.jam_akhir}`,
                        color: item.Prodi?.warna || "#3b82f6",
                        matkul_preferensi: item.matkul_preferensi,
                        prodi: item.prodi,
                        hari: item.hari
                    };
                });

                setEvents(mapped);
            } catch (err) {
                console.error("Error in useLectureAvailabilitySchedule:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleEventClick = (clickInfo) => {
        const event = events.find((e) => e.id === clickInfo.event.id);

        if (event?.matkul_preferensi !== null) {
            Swal.fire({
                icon: "warning",
                title: "Tidak dapat dialokasikan",
                text: "Tidak dapat mengalokasikan prodi pada jadwal ini karena dosen memiliki mata kuliah prefrensinya",
            });
            return;
        }

        const jamMulai = event.start.split("T")[1];
        const jamAkhir = event.end.split("T")[1];

        setEditingEvent({
            ...event,
            jam_mulai: jamMulai,
            jam_akhir: jamAkhir
        });
        setShowModal(true);
    };

    const handleEditSubmit = async () => {
        try {
            await editAlokasiProdi(editingEvent.id, {
                matkul_preferensi: null,
                hari: dayReverseMap[editingEvent.start.split("T")[0]],
                jam_mulai: editingEvent.jam_mulai,
                jam_akhir: editingEvent.jam_akhir,
                added_to_jadwal: false,
                prodi: prodi
            });

            Swal.fire("Berhasil", "Jadwal berhasil diperbarui", "success")
                .then(() => {
                    setShowModal(false);
                    window.location.reload();
                });

        } catch (err) {
            Swal.fire("Gagal", "Terjadi kesalahan saat update", "error");
            console.log(err);
        }
    };


    const filteredEvents = selectedDosen === "all"
        ? events
        : events.filter(e => e.dosenId === selectedDosen);

    return {
        events: filteredEvents,
        dosenList,
        selectedDosen,
        setSelectedDosen,
        loading,
        handleEventClick,
        editingEvent,
        setEditingEvent,
        showModal,
        setShowModal,
        handleEditSubmit,
    };
};
