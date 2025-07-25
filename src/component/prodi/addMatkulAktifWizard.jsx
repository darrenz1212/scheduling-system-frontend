import React, { useState } from "react";
import Select from "react-select";
import { useAddPeriodWizard } from "../../hooks/prodi/course/useAddPeriodWizard.jsx";
import { useSelector } from "react-redux";

const AddMatkulAktifWizard = ({ setShowAddModal }) => {
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
        setStep
    } = useAddPeriodWizard();

    const [searchTerm, setSearchTerm] = useState("");
    const dosenList = useSelector((state) => state.dosen.data) || [];

    const filteredCourses = allCourses.filter((course) =>
        course.nama_matkul.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (step === 1) {
        return (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
                <div className="min-h-screen flex items-center justify-center p-6">
                    <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Pilih Mata Kuliah</h2>
                            <div className="relative w-64">
                                <input
                                    type="text"
                                    placeholder="Cari mata kuliah..."
                                    className="border px-3 py-1 pr-8 rounded text-sm w-full"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <button
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                                        onClick={() => setSearchTerm("")}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        </div>

                        {loadingCourses ? (
                            <p>Loading...</p>
                        ) : (
                            <div className="overflow-y-auto flex-grow">
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
                                    {filteredCourses.map((course) => (
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
                            </div>
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

    const data = wizardData[currentPage];
    // const kelasSudahTerpakai = data.kelasTerpakai || [];

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 overflow-y-auto">
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
                    <h4 className="text-xl font-bold mb-6 text-center">
                        {
                            allCourses.find((c) => c.id === data.id)?.nama_matkul || data.id
                        }
                    </h4>

                    <div className="space-y-4">

                        {/* STEP 1: Jumlah Kelas */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Jumlah Kelas</label>
                            <input
                                type="number"
                                min="1"
                                value={data.jumlahKelas || ""}
                                onChange={(e) => {
                                    const jumlah = parseInt(e.target.value) || 0;
                                    const abjad = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                                    const kelasSudahTerpakai = data.kelasTerpakai || [];

                                    const abjadAvailable = abjad.split("").filter((huruf) => !kelasSudahTerpakai.includes(huruf));

                                    const kelasBaru = Array.from({ length: jumlah }).map((_, idx) => ({
                                        kelas: abjadAvailable[idx] || abjad[idx],
                                        dosenTeori: "",
                                        pisahDosen: false,
                                        dosenPraktikum: "",
                                        pisahPraktikum: false
                                    }));


                                    updateWizardData(currentPage, "jumlahKelas", jumlah);
                                    updateWizardData(currentPage, "kelasList", kelasBaru);
                                }}
                                className="w-full border rounded px-3 py-2"
                                placeholder="Contoh: 3"
                            />
                        </div>

                        {Array.isArray(data.kelasList) && data.kelasList.map((kls, idx) => (
                            <div key={idx} className="border border-gray-300 p-4 rounded mb-4">
                                <p className="font-semibold mb-2">Kelas {kls.kelas}</p>

                                {/* Dosen Teori */}
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700">Dosen Teori</label>
                                    <Select
                                        value={dosenList.find((d) => d.user_id === kls.dosenTeori) || null}
                                        onChange={(selected) => {
                                            const updated = [...data.kelasList];
                                            updated[idx].dosenTeori = selected?.user_id || "";
                                            updated[idx].dosenPraktikum = selected?.user_id || ""; // default sama
                                            updateWizardData(currentPage, "kelasList", updated);
                                        }}
                                        options={dosenList}
                                        getOptionLabel={(d) => `${d.username} (${d.user_id})`}
                                        getOptionValue={(d) => d.user_id}
                                        placeholder="Pilih Dosen Teori"
                                        classNamePrefix="react-select"
                                    />
                                </div>

                                {/* Checkbox Pisah Dosen Praktikum */}
                                {data.hasPraktikum && (
                                    <div className="mb-3">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={kls.pisahDosen || false}
                                                onChange={(e) => {
                                                    const updated = [...data.kelasList];
                                                    updated[idx].pisahDosen = e.target.checked;
                                                    updateWizardData(currentPage, "kelasList", updated);
                                                }}
                                                className="form-checkbox"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">Pisahkan Dosen Praktikum</span>
                                        </label>
                                    </div>
                                )}

                                {/* Select Dosen Praktikum */}
                                {data.hasPraktikum && kls.pisahDosen && (
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700">Dosen Praktikum</label>
                                        <Select
                                            value={dosenList.find((d) => d.user_id === kls.dosenPraktikum) || null}
                                            onChange={(selected) => {
                                                const updated = [...data.kelasList];
                                                updated[idx].dosenPraktikum = selected?.user_id || "";
                                                updateWizardData(currentPage, "kelasList", updated);
                                            }}
                                            options={dosenList}
                                            getOptionLabel={(d) => `${d.username} (${d.user_id})`}
                                            getOptionValue={(d) => d.user_id}
                                            placeholder="Pilih Dosen Praktikum"
                                        />
                                    </div>
                                )}
                                {/* Pisahkan Praktikum */}
                                {data.hasPraktikum && allCourses.find(c => c.id === data.id)?.sks_praktikum > 1 && (
                                    <div className="mb-3">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={kls.pisahPraktikum || false}
                                                onChange={(e) => {
                                                    const updated = [...data.kelasList];
                                                    updated[idx].pisahPraktikum = e.target.checked;
                                                    updateWizardData(currentPage, "kelasList", updated);
                                                }}
                                                className="form-checkbox"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">Pisahkan Praktikum (2 sesi x 1 SKS)</span>
                                        </label>
                                    </div>
                                )}

                            </div>
                        ))}


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

export default AddMatkulAktifWizard;
