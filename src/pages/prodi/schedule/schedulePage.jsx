import React from "react";
import ProdiNav from "../prodiNav.jsx";
import FullCalendarWrapper from "../../../widgets/FullCalenderWrapper.jsx";
import { useScheduleSystem } from "../../../hooks/prodi/useScheduleSystem.jsx";
import RoomPickerModal from "../../../component/RoomPickerModal.jsx";
import EditScheduleModal from "../../../component/EditScheduleModal.jsx";
import { exportScheduleToExcel } from "../../../exportToExcel.js";
import Select from "react-select";

const SchedulePage = () => {
    const {
        events,
        availabilityRanges,
        filterOptions,
        handleFilterChange,
        loading,
        isEmpty,
        hasEdits,
        handleEventClick,
        handleEventDrop,
        handleEventResize,
        generateAndAddSchedule,
        saveChanges,
        roomModal,
        closeRoomModal,
        scheduleModal,
        closeScheduleModal,
        handleScheduleModalSave,
        getBusyEvents,
        getRuanganList
    } = useScheduleSystem();

    return (
        <div className="flex flex-col w-full h-screen bg-gray-100 p-6 relative">
            <ProdiNav />

            <div className="ml-auto mr-20 w-7/12 max-w-5xl bg-white shadow-lg rounded-lg p-4 relative">
                <h2 className="text-xl font-semibold text-center mb-4">
                    Jadwal Perkuliahan
                </h2>

                <button
                    className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 text-sm rounded-md hover:bg-green-600 transition"
                    onClick={() => exportScheduleToExcel(events)}
                >
                    Download Excel
                </button>

                <div className="mb-4">
                    <label className="block mb-1 font-medium text-gray-700">
                        Filter Jadwal Berdasarkan
                    </label>
                    <Select
                        options={filterOptions}
                        onChange={handleFilterChange}
                        className="mb-2 z-50"
                        classNamePrefix="react-select"
                        isSearchable
                        placeholder="Pilih Semester/Mata Kuliah/Dosen"
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                    />
                </div>

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
                    <>
                        <FullCalendarWrapper
                            editable
                            events={events}
                            businessHours={availabilityRanges}
                            eventConstraint={{ values: availabilityRanges }}
                            handleEventClick={handleEventClick}
                            eventDrop={handleEventDrop}
                            eventResize={handleEventResize}
                        />
                        <button
                            className={`mt-4 px-4 py-2 rounded-md text-white float-right transition ${
                                hasEdits
                                    ? "bg-blue-500 hover:bg-blue-600"
                                    : "bg-gray-300 cursor-not-allowed"
                            }`}
                            onClick={saveChanges}
                            disabled={!hasEdits}
                        >
                            Save
                        </button>
                    </>
                )}
            </div>

            {roomModal.open && (
                <RoomPickerModal
                    jadwal={roomModal.data}
                    onClose={closeRoomModal}
                />
            )}

            {scheduleModal.open && (
                <EditScheduleModal
                    open={scheduleModal.open}
                    data={scheduleModal.data}
                    availabilityRanges={availabilityRanges}
                    getBusyEvents={getBusyEvents}
                    ruanganList={getRuanganList()}
                    sks={scheduleModal.data?.MatkulAktif?.sks || 2}
                    onClose={closeScheduleModal}
                    onSave={handleScheduleModalSave}
                />
            )}
        </div>
    );
};

export default SchedulePage;
