import React from "react";
import ProdiNav from "../prodiNav.jsx";
import FullCalendarWrapper from "../../../widgets/FullCalenderWrapper.jsx";
import { useScheduleSystem } from "../../../hooks/prodi/useScheduleSystem.jsx";

const SchedulePage = () => {
    const {
        events,
        semesterOptions,
        selectedSemester,
        setSelectedSemester,
        loading,
        handleEventClick,
        isEmpty,
        generateAndAddSchedule
    } = useScheduleSystem();

    return (
        <div className="flex flex-col w-full h-screen bg-gray-100 p-6 relative">
            <ProdiNav />
            <div className="ml-auto mr-20 w-7/12 max-w-5xl bg-white shadow-lg rounded-lg p-4">
                <h2 className="text-xl font-semibold text-center mb-4">
                    Jadwal Perkuliahan
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

                {/* Content */}
                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : isEmpty ? (
                    <div className="text-center space-y-4">
                        <p className="text-gray-700">Belum ada jadwal pada periode ini.</p>
                        <button
                            onClick={generateAndAddSchedule}
                            className="bg-[#0db0bb] text-white px-6 py-2 rounded-lg hover:bg-[#0aa2a8] transition"
                        >
                            Generate Jadwal Sekarang
                        </button>
                    </div>
                ) : (
                    <FullCalendarWrapper events={events} handleEventClick={handleEventClick} />
                )}
            </div>
        </div>
    );
};

export default SchedulePage;
