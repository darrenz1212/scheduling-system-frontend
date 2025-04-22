import React from "react";
import ProdiNav from "../prodiNav.jsx";
import FullCalendarWrapper from "../../../widgets/FullCalenderWrapper.jsx";
import { useScheduleSystem } from "../../../hooks/prodi/useScheduleSystem.jsx";
import Swal from "sweetalert2";

const SchedulePage = () => {
    const {
        events,
        semesterOptions,
        selectedSemester,
        setSelectedSemester,
        loading,
        handleEventClick
    } = useScheduleSystem();


    return (
        <div className="flex flex-col w-full h-screen bg-gray-100 p-6 relative">
            <ProdiNav />
            <div className="ml-auto mr-20 w-7/12 max-w-5xl bg-white shadow-lg rounded-lg p-4">
                <h2 className="text-xl font-semibold text-center mb-4">
                    Jadwal Perkuliahan Berdasarkan Semester
                </h2>

                {/* Select Box Semester */}
                <div className="mb-4">
                    <label htmlFor="semesterSelect" className="block mb-1 font-medium text-gray-700">
                        Pilih Semester
                    </label>
                    <select
                        id="semesterSelect"
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                    >
                        <option value="all">Semua Semester</option>
                        {semesterOptions.map((s) => (
                            <option key={s} value={s}>Semester {s}</option>
                        ))}
                    </select>
                </div>

                {/* Calendar */}
                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : (
                    <FullCalendarWrapper events={events} handleEventClick={handleEventClick} />
                )}
            </div>
        </div>
    );
};

export default SchedulePage;
