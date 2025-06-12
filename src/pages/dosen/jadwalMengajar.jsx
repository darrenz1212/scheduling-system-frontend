import React from "react";
import DosenNav from "./dosenNav.jsx";
import FullCalendarWrapper from "../../widgets/FullCalenderWrapper.jsx";
import { useJadwalMengajar } from "../../hooks/dosen/useJadwalMengajar.jsx";
import { useSelector } from "react-redux";

const JadwalMengajar = () => {
    const { events, loading } = useJadwalMengajar();
    const user = useSelector((state) => state.auth.user);


    return (
        <div className="flex w-full min-h-screen bg-gray-100 p-6 overflow-y-auto">
            <DosenNav />
            <div className="ml-auto mr-0 w-9/12 max-w-7xl bg-white shadow-lg rounded-lg p-6 max-h-[130vh] overflow-hidden flex flex-col">
                <h2 className="text-xl font-semibold text-center mb-4">
                    Jadwal Mengajar {user.username}
                </h2>
                <div className="flex-grow">
                    {loading ? (
                        <p className="text-center">Memuat jadwal...</p>
                    ) : (
                        <FullCalendarWrapper events={events} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default JadwalMengajar;
