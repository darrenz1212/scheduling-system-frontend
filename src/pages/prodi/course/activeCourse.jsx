import React, { useState } from "react";
import ProdiNav from "../prodiNav.jsx";
import { useActiveCourse } from "../../../hooks/prodi/course/useActiveCourse.jsx";
import AddPeriodWizard from "../../../component/prodi/addPeriodWizard.jsx";
import Select from "react-select";



const ActiveCourse = () => {
    const {
        activeMatkulList,
        loading,
        periodeList,
        selectedPeriode,
        setSelectedPeriode,
        showAddModal,
        setShowAddModal,
        editData,
        setEditData,
        openEditModal,
        updateMatkulDosen,
        dosenList,
    } = useActiveCourse();

    const [searchTerm, setSearchTerm] = useState("");
    const [editModalOpen, setEditModalOpen] = useState(false);

    const filteredCourses = activeMatkulList.filter((item) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (item.id_matkul || "").toLowerCase().includes(searchLower) ||
            (item.MataKuliah?.nama_matkul || "").toLowerCase().includes(searchLower) ||
            (item.User?.username || "").toLowerCase().includes(searchLower) ||
            (item.kelas || "").toLowerCase().includes(searchLower)
        );
    });

    const handleEditOpen = async (matkul) => {
        await openEditModal(matkul);
        setEditData(matkul);
        setEditModalOpen(true);
    };

    return (
        <div className="flex bg-gray-100 min-h-screen w-full">
            <ProdiNav />
            <div className="flex flex-col w-full bg-white shadow-lg rounded-none p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <h6 className="text-2xl font-semibold text-gray-800">Mata Kuliah Aktif</h6>
                        <select
                            value={selectedPeriode}
                            onChange={(e) => setSelectedPeriode(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0db0bb]"
                        >
                            {periodeList.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.nama}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto items-stretch md:items-center">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cari Matkul / Dosen / Kelas..."
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-[#0db0bb]"
                        />
                        <button
                            className="bg-[#0db0bb] text-white px-3 py-1.5 rounded-md hover:bg-[#0aa2a8] transition text-xs"
                            onClick={() => setShowAddModal(true)}
                        >
                            Tambah Mata Kuliah
                        </button>
                    </div>
                </div>

                {loading ? (
                    <p className="text-gray-500 text-center">Loading...</p>
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#ecfafa] text-[#0db0bb] font-semibold">
                            <tr>
                                <th className="p-3 border-b">ID Matkul</th>
                                <th className="p-3 border-b">Nama</th>
                                <th className="p-3 border-b">SKS</th>
                                <th className="p-3 border-b">Kelas</th>
                                <th className="p-3 border-b">Semester</th>
                                <th className="p-3 border-b">Dosen</th>
                                <th className="p-3 border-b">Periode</th>
                                <th className="p-3 border-b">Aksi</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredCourses.length > 0 ? (
                                filteredCourses.map((item) => (
                                    <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                                        <td className="p-3">{item.id_matkul}</td>
                                        <td className="p-3">
                                            {item.MataKuliah?.nama_matkul}
                                            {item.praktikum && <strong> (Praktikum)</strong>}
                                        </td>
                                        <td className="p-3">{item.sks}</td>
                                        <td className="p-3">{item.kelas}</td>
                                        <td className="p-3">{item.MataKuliah?.semester}</td>
                                        <td className="p-3">{item.User?.username}</td>
                                        <td className="p-3">{item.Periode?.nama}</td>
                                        <td className="p-3">
                                            <button
                                                className="bg-[#0db0bb] text-white px-4 py-2 rounded-lg hover:bg-[#0aa2a8] transition text-sm"
                                                onClick={() => handleEditOpen(item)}
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-6 text-gray-500">
                                        Tidak ada data ditemukan.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showAddModal && <AddPeriodWizard setShowAddModal={setShowAddModal} />}

            {/* Modal Edit */}
            {editModalOpen && editData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-md">
                        <h2 className="text-xl font-bold text-center mb-4">Edit Dosen Pengampu</h2>
                        <div className="mb-3">
                            <label className="block text-sm text-gray-600">ID Mata Kuliah</label>
                            <input value={editData?.id_matkul} readOnly className="w-full border rounded px-3 py-2 bg-gray-100" />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm text-gray-600">Nama Mata Kuliah</label>
                            <input value={editData?.MataKuliah?.nama_matkul} readOnly className="w-full border rounded px-3 py-2 bg-gray-100" />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm text-gray-600">Jenis</label>
                            <input
                                value={editData?.praktikum ? "Praktikum" : "Teori"}
                                readOnly
                                className="w-full border rounded px-3 py-2 bg-gray-100"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm text-gray-600">Dosen</label>
                            <Select
                                value={dosenList.find((d) => d.user_id === editData.dosen) || null}
                                onChange={(selectedOption) => {
                                    console.log("Dosen selected:", selectedOption); // <- debug ini
                                    setEditData((prev) => ({
                                        ...prev,
                                        dosen: selectedOption.user_id,
                                    }));
                                }}
                                options={dosenList}
                                getOptionLabel={(d) => `${d.username.trim()} (${d.user_id})`}
                                getOptionValue={(d) => d.user_id}
                                placeholder="Pilih Dosen"
                                className="react-select-container"
                                classNamePrefix="react-select"
                            />





                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                className="bg-gray-300 px-4 py-2 rounded"
                                onClick={() => setEditModalOpen(false)}
                            >
                                Batal
                            </button>
                            <button
                                className="bg-[#0db0bb] text-white px-4 py-2 rounded hover:bg-[#0aa2a8]"
                                onClick={updateMatkulDosen}
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ActiveCourse;