import React from "react";
import ProdiNav from "./prodiNav.jsx";
import FullCalendarWrapper from "../../widgets/FullCalenderWrapper.jsx";
import Select from "react-select";
import { useSelector } from "react-redux";
import { useLectureAvailabilitySchedule } from "../../hooks/prodi/useLectureAvailabilitySchedule.jsx";

const LectureAvailabilitySchedule = () => {
    const {
        events,
        dosenList,
        selectedDosen,
        setSelectedDosen,
        loading,
        handleEventClick,
        editingEvent,
        setEditingEvent,
        showModal,
        setShowModal,
        handleEditSubmit
    } = useLectureAvailabilitySchedule();

    const user = useSelector((state) => state.auth.user);

    return (
        <div className="flex flex-col w-full h-[100vh] bg-gray-100 p-6 relative">
            <ProdiNav />

            <div className="ml-auto mr-0 w-9/12 max-w-7xl bg-white shadow-lg rounded-lg p-6 h-[90vh] flex flex-col justify-between">
                <div>
                    {/* Header + Select Dosen */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Jadwal Ketersediaan Dosen</h2>
                        <div className="w-1/2">
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
                                onChange={(option) => setSelectedDosen(option.value)}
                                placeholder="Pilih Dosen"
                                className="z-50"
                                classNamePrefix="react-select"
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <p className="text-center text-gray-500 py-20">Loading...</p>
                    ) : (
                        <FullCalendarWrapper events={events} handleEventClick={handleEventClick} />
                    )}
                </div>
            </div>

            {/* Modal Edit */}
            {showModal && editingEvent && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                        <h2 className="text-lg font-semibold mb-4 text-center">Detail Jadwal</h2>

                        <div className="mb-4 space-y-1 text-sm">
                            <p>
                                <span className="font-medium">Dosen:</span>{" "}
                                {editingEvent.title.split(" - ")[0]}
                            </p>
                            <p>
                                <span className="font-medium">Waktu:</span>{" "}
                                {`${editingEvent.start.split("T")[1].slice(0, 5)} - ${editingEvent.end
                                    .split("T")[1]
                                    .slice(0, 5)}`}
                            </p>
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                                onClick={() => setShowModal(false)}
                            >
                                Batal
                            </button>
                            <button
                                className={`px-4 py-2 rounded text-white ${
                                    editingEvent.prodi === user.prodi
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-green-600 hover:bg-green-700"
                                }`}
                                onClick={() => {
                                    setEditingEvent({
                                        ...editingEvent,
                                        prodi: user.prodi
                                    });
                                    handleEditSubmit();
                                }}
                            >
                                {editingEvent.prodi === user.prodi
                                    ? "Batalkan Alokasi"
                                    : "Alokasikan untuk Prodi"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LectureAvailabilitySchedule;
