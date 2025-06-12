import React from "react";
import FullCalendarWrapper from "../../widgets/FullCalenderWrapper.jsx";
import DosenNav from "./dosenNav.jsx";
import { usePickAvailableSchedule } from "../../hooks/usePickAvailableSchedule";
import { useSelector } from "react-redux";

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
        title,
        remainingMinutes,
        showMatkulModal,
        toggleMatkulModal,
        matkulAssigned,
        hasMatkulAssigned,
        totalSelectedMinutes,
        isGenerated
    } = usePickAvailableSchedule();

    const matkulOptions = useSelector((state) => state.matkul.data);

    return (
        <div className="flex flex-col w-full h-[120vh] bg-gray-100 p-6 relative">
            <DosenNav/>
            <div
                className="ml-auto mr-0 w-9/12 max-w-7xl bg-white shadow-lg rounded-lg p-6 h-[110vh] flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <button
                            onClick={toggleMatkulModal}
                            className="bg-gray-200 text-sm text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
                        >
                            Lihat Mata Kuliah Diajarkan
                        </button>
                        <div className="text-sm text-gray-600">
                            {remainingMinutes === 0 ? (
                                <>Alokasi waktu: <span
                                    className="font-semibold text-green-600">{totalSelectedMinutes} menit</span></>
                            ) : (
                                <>Sisa waktu perlu dialokasikan: <span
                                    className="font-semibold text-red-500">{remainingMinutes} menit</span></>
                            )}
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold text-center mb-4">
                        Silahkan pilih jadwal ketersediaan mengajar
                    </h2>

                    {!hasMatkulAssigned ? (
                        <div className="text-center text-gray-500 py-20">
                            Anda tidak memiliki jadwal mengajar di periode ini.
                        </div>
                    ) : (
                        <FullCalendarWrapper
                            events={initialEvents}
                            eventClassNames={eventClassNames}
                            handleEventClick={handleEventClick}
                        />
                    )}
                </div>

                {hasMatkulAssigned && (
                    <div className="mt-2 mb-4 flex justify-end">
                        <button
                            className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition ${
                                Object.keys(highlightedEvents).length === 0 || remainingMinutes > 0
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                            onClick={handleNextClick}
                            disabled={
                                Object.keys(highlightedEvents).length === 0 ||
                                remainingMinutes > 0 ||
                                isGenerated
                            }

                        >
                            Next
                        </button>
                    </div>
                )}

            </div>


            {/* Modal Pilih Matkul */}
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
                                            <option value="">Tidak Ada matkul prefrensi</option>
                                            {(matkulOptions || []).map((matkulOption) => (
                                                <option key={matkulOption.id_matkul} value={matkulOption.id}>
                                                    {`${matkulOption.id_matkul} - ${matkulOption.MataKuliah.nama_matkul}${
                                                        matkulOption.praktikum ? " (praktikum)" : ""
                                                    } - ${matkulOption.kelas}`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition mr-2"
                                onClick={handleCloseModal}
                                disabled={loading}
                            >
                                Close
                            </button>
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Info Matkul Diajarkan */}
            {showMatkulModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg max-w-3xl w-full">
                        <h3 className="text-lg font-semibold mb-4 text-center">Mata Kuliah yang Diajarkan</h3>
                        <div className="overflow-x-auto max-h-96 overflow-y-auto">
                            <table className="min-w-full text-sm text-left border border-gray-200">
                                <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 border">ID Matkul</th>
                                    <th className="px-4 py-2 border">Nama</th>
                                    <th className="px-4 py-2 border">Kelas</th>
                                    <th className="px-4 py-2 border">SKS</th>
                                    <th className="px-4 py-2 border">Semester</th>
                                    <th className="px-4 py-2 border">Prodi</th>
                                </tr>
                                </thead>
                                <tbody>
                                {matkulAssigned.map((m) => (
                                    <tr key={m.id}>
                                        <td className="px-4 py-2 border">{m.id_matkul}</td>
                                        <td className="px-4 py-2 border">
                                            {m.MataKuliah.nama_matkul} {m.praktikum ? " Praktikum" : ""}
                                        </td>
                                        <td className="px-4 py-2 border">{m.kelas}</td>
                                        <td className="px-4 py-2 border">{m.sks}</td>
                                        <td className="px-4 py-2 border">{m.MataKuliah.semester}</td>
                                        <td className="px-4 py-2 border">Teknik Informatika</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={toggleMatkulModal}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PickAvailableSchedule;
