import React from "react";
import ProdiNav from "../prodiNav.jsx";
import FullCalendarWrapper from "../../../widgets/FullCalenderWrapper.jsx";
import Select from "react-select";
import { useScheduleSystem } from "../../../hooks/prodi/useScheduleSystem.jsx";
import RoomPickerModal from "../../../component/RoomPickerModal.jsx";
import EditScheduleModal from "../../../component/EditScheduleModal.jsx";
import { ExportToOneMaranatha } from "../../../exportToExcel/exportToOneMaranatha.js";
import { exportScheduleToExcel } from "../../../exportToExcel/exportToExcel.js";
import EmptySchedule from "./emptySchedule.jsx";

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
        saveChanges,
        roomModal,
        closeRoomModal,
        scheduleModal,
        closeScheduleModal,
        handleScheduleModalSave,
        getBusyEvents,
        getRuanganList,
        clearJadwalAll,
    } = useScheduleSystem();

    return (
        <div className="flex flex-col w-full h-screen bg-gray-100 p-6 relative">
            <ProdiNav />

            <div className="ml-auto mr-0 w-9/12 max-w-7xl bg-white shadow-lg rounded-lg p-6 h-[90vh] flex flex-col justify-between">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-2">
                        <button
                            className="bg-green-500 text-white px-3 py-1 text-sm rounded-md hover:bg-green-600 transition"
                            onClick={() => exportScheduleToExcel(events)}
                        >
                            Download Excel
                        </button>
                        <button
                            className="bg-blue-500 text-white px-3 py-1 text-sm rounded-md hover:bg-blue-600 transition"
                            onClick={() => ExportToOneMaranatha(events)}
                        >
                            Export To One Maranatha
                        </button>
                    </div>
                    <div className="w-1/2">
                        <Select
                            options={filterOptions}
                            onChange={handleFilterChange}
                            className="z-50"
                            classNamePrefix="react-select"
                            isSearchable
                            placeholder="Pilih Semester/Mata Kuliah/Dosen"
                            menuPortalTarget={document.body}
                            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <p className="text-center text-gray-500 py-20">Loading...</p>
                    ) : isEmpty ? (
                        <EmptySchedule/>
                    ) : (
                        <FullCalendarWrapper
                            editable
                            events={events}
                            businessHours={availabilityRanges}
                            eventConstraint={{ values: availabilityRanges }}
                            handleEventClick={handleEventClick}
                            eventDrop={handleEventDrop}
                            eventResize={handleEventResize}
                        />
                    )}
                </div>

                <div className="mt-4 flex justify-between">
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                        onClick={clearJadwalAll}
                    >
                        Clear Jadwal
                    </button>
                </div>
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
