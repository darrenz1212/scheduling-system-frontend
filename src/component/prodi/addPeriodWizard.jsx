import React from "react";
import { useAddPeriodWizard } from "../../hooks/prodi/course/useAddPeriodWizard.jsx";
import { useSelector } from "react-redux";

const AddPeriodWizard = ({ setShowAddModal }) => {

    const {
        step,
        allCourses,
        loadingCourses,
        selectedCourseIds,
        toggleCourseSelection,
        proceedToWizard,
        wizardData,
        currentPage,
        updateWizardData,
        nextPage,
        prevPage,
        submitWizard,
        submitting,
        error,
        setStep,
        periodeList,
        selectedPeriodeId,
        setSelectedPeriodeId
    } = useAddPeriodWizard();

    const dosenList = useSelector((state) => state.dosen.data) || [];


    if (step === 1) {
        return (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 overflow-y-auto">
                <div className="min-h-screen flex items-center justify-center p-6">
                    <div className="bg-white p-6 rounded-lg w-full max-w-4xl">
                        <h2 className="text-xl font-semibold mb-4">Pilih Mata Kuliah</h2>
                        {loadingCourses ? (
                            <p>Loading...</p>
                        ) : (
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-100 font-semibold">
                                <tr>
                                    <th className="p-2 border">ID</th>
                                    <th className="p-2 border">Nama</th>
                                    <th className="p-2 border">Semester</th>
                                    <th className="p-2 border text-right">Pilih</th>
                                </tr>
                                </thead>
                                <tbody>
                                {allCourses.map((course) => (
                                    <tr key={course.id} className="border-b">
                                        <td className="p-2">{course.id}</td>
                                        <td className="p-2">{course.nama_matkul}</td>
                                        <td className="p-2">{course.semester}</td>
                                        <td className="p-2 text-right">
                                            <input
                                                type="checkbox"
                                                checked={selectedCourseIds.includes(course.id)}
                                                onChange={() => toggleCourseSelection(course.id)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                        <div className="flex justify-between items-center mt-4">
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setStep(null);
                                }}
                                className="text-blue-600 underline"
                            >
                                Batal
                            </button>


                            <button
                                onClick={proceedToWizard}
                                disabled={selectedCourseIds.length === 0}
                                className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 overflow-y-auto">
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
                    <h4 className="text-xl font-bold mb-6 text-center">
                        {
                            allCourses.find(
                                (c) => c.id === wizardData[currentPage].id
                            )?.nama_matkul || wizardData[currentPage].id
                        }
                    </h4>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">SKS Teori</label>
                            <input
                                type="number"
                                value={wizardData[currentPage].sks}
                                onChange={(e) =>
                                    updateWizardData(currentPage, "sks", e.target.value)
                                }
                                className="w-full border rounded px-3 py-2"
                                placeholder="Contoh: 3"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium">Ada Praktikum?</label>
                            <input
                                type="checkbox"
                                checked={wizardData[currentPage].enablePraktikum}
                                onChange={(e) =>
                                    updateWizardData(
                                        currentPage,
                                        "enablePraktikum",
                                        e.target.checked
                                    )
                                }
                            />
                        </div>

                        {wizardData[currentPage].enablePraktikum && (
                            <div>
                                <label className="block text-sm font-medium">SKS Praktikum</label>
                                <input
                                    type="number"
                                    value={wizardData[currentPage].sks_praktikum || ""}
                                    onChange={(e) =>
                                        updateWizardData(
                                            currentPage,
                                            "sks_praktikum",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="Contoh: 1"
                                />
                            </div>
                        )}

                        {/*<div>*/}
                        {/*    <label className="block text-sm font-medium">Dosen</label>*/}
                        {/*    <select*/}
                        {/*        value={wizardData[currentPage].dosen}*/}
                        {/*        onChange={(e) =>*/}
                        {/*            updateWizardData(currentPage, "dosen", e.target.value)*/}
                        {/*        }*/}
                        {/*        className="w-full border rounded px-3 py-2"*/}
                        {/*    >*/}
                        {/*        <option value="">Pilih Dosen</option>*/}
                        {/*        {dosenList.map((dosen) => (*/}
                        {/*            <option key={dosen.user_id} value={dosen.user_id}>*/}
                        {/*                {dosen.user_id} - {dosen.username}*/}
                        {/*            </option>*/}
                        {/*        ))}*/}
                        {/*    </select>*/}
                        {/*</div>*/}

                        <div>
                            <div>
                                <label className="block text-sm font-medium">Jumlah Kelas</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={wizardData[currentPage].jumlahKelas || ""}
                                    onChange={(e) => {
                                        const jumlah = parseInt(e.target.value) || 0;
                                        const abjad = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                                        const kelasList = Array.from({length: jumlah}).map((_, idx) => ({
                                            kelas: abjad[idx],
                                            dosen: "",
                                        }));
                                        updateWizardData(currentPage, "jumlahKelas", jumlah);
                                        updateWizardData(currentPage, "kelasList", kelasList);
                                    }}
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="Contoh: 3"
                                />
                            </div>

                            {Array.isArray(wizardData[currentPage].kelasList) &&
                                wizardData[currentPage].kelasList.map((kls, idx) => (
                                    <div key={idx}>
                                        <label className="block text-sm font-medium">Dosen untuk
                                            Kelas {kls.kelas}</label>
                                        <select
                                            value={kls.dosen}
                                            onChange={(e) => {
                                                const updatedList = [...wizardData[currentPage].kelasList];
                                                updatedList[idx].dosen = e.target.value;
                                                updateWizardData(currentPage, "kelasList", updatedList);
                                            }}
                                            className="w-full border rounded px-3 py-2"
                                        >
                                            <option value="">Pilih Dosen</option>
                                            {dosenList.map((dosen) => (
                                                <option key={dosen.user_id} value={dosen.user_id}>
                                                    {dosen.user_id} - {dosen.username}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                        </div>

                    </div>


                    <div className="flex justify-between items-center mt-6">
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 0}
                            className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <div className="flex gap-1">
                            {wizardData.map((_, index) => (
                                <span
                                    key={index}
                                    className={`w-3 h-3 rounded-full ${
                                        index === currentPage ? "bg-blue-600" : "bg-gray-300"
                                    }`}
                                />
                            ))}
                        </div>

                        {currentPage < wizardData.length - 1 ? (
                            <button
                                onClick={nextPage}
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                onClick={submitWizard}
                                disabled={submitting}
                                className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
                            >
                                {submitting ? "Submitting..." : "Submit"}
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() => setStep(1)}
                        className="absolute top-2 right-4 text-sm text-blue-600 underline"
                    >
                        Back
                    </button>

                    {error && (
                        <p className="text-red-500 text-sm mt-2 text-center">
                            {error.message || "Error saat menyimpan"}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddPeriodWizard;
