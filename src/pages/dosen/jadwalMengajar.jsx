import React from "react";
import DosenNav from "./dosenNav.jsx";
import FullCalendarWrapper from "../../widgets/FullCalenderWrapper.jsx";
import { useJadwalMengajar } from "../../hooks/dosen/useJadwalMengajar.jsx";
import { useSelector } from "react-redux";

const JadwalMengajar = () => {
    const { events, loading } = useJadwalMengajar();

    const user = useSelector((state) => state.auth.user)

    return (
        <div className="flex justify-end w-full h-screen bg-gray-100 p-6">
            <DosenNav />
            <div className="mr-20 w-8/12 max-w-7xl bg-white shadow-lg rounded-lg p-4">
                <h2 className="text-xl font-semibold text-center mb-4">Jadwal Mengajar {user.username}</h2>
                {loading ? (
                    <p className="text-center">Memuat jadwal...</p>
                ) : (
                    <FullCalendarWrapper events={events} />
                )}
            </div>
        </div>
    );
};

export default JadwalMengajar;
