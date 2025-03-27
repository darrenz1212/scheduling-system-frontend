import React from "react";
import ProdiNav from "./prodiNav.jsx";
import FullCalendarWrapper from "../../widgets/FullCalenderWrapper.jsx";
import { useLectureAvailabilitySchedule } from "../../hooks/prodi/useLectureAvailabilitySchedule.jsx";

const LectureAvailabilitySchedule = () => {
    const {
        events,
        dosenList,
        selectedDosen,
        setSelectedDosen,
        loading
    } = useLectureAvailabilitySchedule();

    return (
        <div className="flex flex-col w-full h-screen bg-gray-100 p-6 relative">
            <ProdiNav />
            <div className="ml-auto mr-20 w-7/12 max-w-5xl bg-white shadow-lg rounded-lg p-4">
                <h2 className="text-xl font-semibold text-center mb-4">
                    Jadwal Ketersediaan Dosen
                </h2>

                {/* Select Box Filter */}
                <div className="mb-4">
                    <label htmlFor="dosenSelect" className="block mb-1 font-medium text-gray-700">
                        Pilih Dosen
                    </label>
                    <select
                        id="dosenSelect"
                        value={selectedDosen}
                        onChange={(e) => setSelectedDosen(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                        <option value="all">Semua Dosen</option>
                        {dosenList.map((dosen) => (
                            <option key={dosen.user_id} value={dosen.user_id}>
                                {dosen.user_id} - {dosen.username}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Calendar */}
                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : (
                    <FullCalendarWrapper events={events} />
                )}
            </div>
        </div>
    );
};

export default LectureAvailabilitySchedule;
