import React from "react";
import FullCalendarWrapper from "../../widgets/FullCalenderWrapper.jsx";
import DosenNav from "./dosenNav.jsx";
import {useSelector} from "react-redux";

const ScheduleDosen = () => {
    const events = [
        { title: "Kuliah AI", start: "mondayT08:00:00", end: "mondayT10:00:00" },
        { title: "Praktikum Jaringan", start: "tuesdayT10:00:00", end: "tuesdayT12:00:00" },
        { title: "Rapat Proyek", start: "thursdayT13:00:00", end: "thursdayT14:30:00" },
        { title: "Metode Penelitian", start: "fridayT13:00:00", end: "fridayT14:30:00" },
    ];

    const user = useSelector(
    (state) => state.auth.user
    )

    return (
        <div className="flex justify-end w-full h-screen bg-gray-100 p-6">
            <DosenNav/>
            <div className="mr-20 w-8/12 max-w-7xl bg-white shadow-lg rounded-lg p-4">
                <h2 className="text-xl font-semibold text-center mb-4">Timetable Mingguan {user.username}</h2>
                <FullCalendarWrapper events={events} />
            </div>
        </div>
    );
};

export default ScheduleDosen;
