import { useEffect, useState } from "react";
import { fetchAllAvailableSchedule, fetchDosenList } from "../../api/AvailableScheduleService";

const dayMap = {
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday"
};

export const useLectureAvailabilitySchedule = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dosenList, setDosenList] = useState([]);
    const [selectedDosen, setSelectedDosen] = useState("all");

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
                        backgroundColor: "#3b82f6",
                        borderColor: "#2563eb",
                        textColor: "white",
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

    // Filter event berdasarkan dosen yang dipilih
    const filteredEvents = selectedDosen === "all"
        ? events
        : events.filter(e => e.dosenId === selectedDosen);

    return { events: filteredEvents, dosenList, selectedDosen, setSelectedDosen, loading };
};
