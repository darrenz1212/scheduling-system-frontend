import {
    fetchAllAvailableSchedule,
    fetchDosenList
} from "../../api/AvailableScheduleService.js";
import { useEffect, useState } from "react";

export const useCheckDosenAvailability = () => {
    const [dosenSchedule, setDosenSchedule] = useState([]);
    const [dosenList, setDosenList] = useState([]);
    const [emptySchedule, setEmptySchedule] = useState([]);

    useEffect(() => {
        const fetchAvailableScheduleList = async () => {
            try {
                const res = await fetchAllAvailableSchedule();
                // Ambil list user_id dari entri jadwal
                const filledUserIds = res.result.map(item => item.dosen);
                setDosenSchedule(filledUserIds);
            } catch (e) {
                console.error(e);
            }
        };

        fetchAvailableScheduleList();
    }, []);

    useEffect(() => {
        const fetchDosen = async () => {
            try {
                const res = await fetchDosenList();
                setDosenList(res);
            } catch (e) {
                console.error(e);
            }
        };

        fetchDosen();
    }, []);

    useEffect(() => {
        if (dosenList.length === 0 || dosenSchedule.length === 0) return;

        const belumIsi = dosenList.filter(
            dosen => !dosenSchedule.includes(dosen.user_id)
        );

        const formatted = belumIsi.map(
            dosen => `${dosen.user_id} - ${dosen.username} `
        );

        setEmptySchedule(formatted);
    }, [dosenList, dosenSchedule]);

    return {
        emptySchedule,
        isLoading: dosenList.length === 0 || dosenSchedule.length === 0,
    };
};
