import React from "react";
import FullCalendarWrapper from "../../widgets/FullCalenderWrapper.jsx";
import DosenNav from "./dosenNav.jsx";
import { usePickAvailableSchedule } from "../../hooks/usePickAvailableSchedule";
import {useSelector} from "react-redux";

const PickAvailableSchedule = () => {
    const {
        highlightedEvents,
        handleEventClick,
        eventClassNames,
        initialEvents,
        showModal,
        handleNextClick,
        handleCloseModal,
        preferences,
        handleInputChange,
        handleSubmit,
        loading,
        formatScheduleLabel,
        title
    } = usePickAvailableSchedule();

    const matkulOptions = useSelector((state) => state.matkul.data);

    // console.log(matkulList)



    return (
        <div className="flex flex-col w-full h-screen bg-gray-100 p-6 relative">
            <DosenNav />
            <div className="ml-auto mr-20 w-7/12 max-w-5xl bg-white shadow-lg rounded-lg p-4">
                <h2 className="text-xl font-semibold text-center mb-4">
                    Silahkan pilih jadwal ketersediaan mengajar
                </h2>
                <FullCalendarWrapper
                    events={initialEvents}
                    eventClassNames={eventClassNames}
                    handleEventClick={handleEventClick}
                />
                <div className="flex justify-end mt-4">
                    <button
                        className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition ${
                            Object.keys(highlightedEvents).length === 0 ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={handleNextClick}
                        disabled={Object.keys(highlightedEvents).length === 0}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                        <h2 className="text-lg font-semibold mb-4 text-center">{title}</h2>
                        <div className="max-h-60 overflow-y-auto">
                            {Object.keys(highlightedEvents).map((id) => {
                                const selectedEvent = initialEvents.find((event) => event.id === id);
                                return (
                                    <div key={id} className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">
                                            {formatScheduleLabel(selectedEvent)}
                                        </label>
                                        <select
                                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                                            value={preferences[id] || ""}
                                            onChange={(e) => handleInputChange(id, e.target.value)}
                                        >
                                            <option value="">Pilih Mata Kuliah</option>
                                            {(matkulOptions || []).map((matkulOption) => (
                                                <option key={matkulOption.id_matkul} value={matkulOption.id}>
                                                    {`${matkulOption.id_matkul} - ${matkulOption.MataKuliah.nama_matkul}${
                                                        matkulOption.praktikum ? " (praktikum)" : ""
                                                    }- ${matkulOption.kelas}`}
                                                </option>
                                            ))}

                                        </select>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-end mt-4">
                            <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition mr-2" onClick={handleCloseModal} disabled={loading}>
                                Close
                            </button>
                            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition" onClick={handleSubmit} disabled={loading}>
                                {loading ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PickAvailableSchedule;
