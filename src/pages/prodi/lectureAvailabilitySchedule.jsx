import React from "react";
import ProdiNav from "./prodiNav.jsx";
import FullCalendarWrapper from "../../widgets/FullCalenderWrapper.jsx";
import { useLectureAvailabilitySchedule } from "../../hooks/prodi/useLectureAvailabilitySchedule.jsx";
import Select from "react-select";


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
                    <Select
                        options={[
                            { value: "all", label: "Semua Dosen" },
                            ...dosenList.map((d) => ({
                                value: d.user_id,
                                label: `${d.user_id} - ${d.username.trim()}`
                            }))
                        ]}
                        value={
                            selectedDosen === "all"
                                ? { value: "all", label: "Semua Dosen" }
                                : dosenList
                                .map((d) => ({
                                    value: d.user_id,
                                    label: `${d.user_id} - ${d.username.trim()}`
                                }))
                                .find((option) => option.value === selectedDosen) || null
                        }
                        onChange={(selectedOption) => setSelectedDosen(selectedOption.value)}
                        placeholder="Pilih Dosen"
                        className="react-select-container"
                        classNamePrefix="react-select"
                        menuPortalTarget={document.body} // <- render di root document
                        styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }) // <- pastikan di atas fullcalendar
                        }}
                    />


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
