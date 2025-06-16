import React from "react";
import ProdiNav from "../prodiNav.jsx";
import { useAllCourse } from "../../../hooks/prodi/course/useAllCourse.jsx";

const AllCourse = () => {
    const {
        matkulList,
        loading,
        searchTerm,
        setSearchTerm,
        showAddModal,
        setShowAddModal,
        showEditModal,
        setShowEditModal,
        formData,
        setFormData,
        handleInputChange,
        handleSubmitAdd,
        handleSubmitEdit,
        openEditModal,
    } = useAllCourse();

    const filteredMatkul = matkulList.filter((matkul) =>
        matkul.nama_matkul.toLowerCase().includes(searchTerm.toLowerCase()) ||
        matkul.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
            <div className="flex flex-col w-full bg-white shadow-lg rounded-none p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <h2 className="text-2xl font-semibold text-gray-800">List Mata Kuliah</h2>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cari Nama Matkul / ID Matkul..."
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-[#0db0bb]"
                        />
                    </div>

                    <button
                        className="bg-[#0db0bb] text-white px-3 py-1.5 rounded-md hover:bg-[#0aa2a8] transition text-xs"
                        onClick={() => setShowAddModal(true)}
                    >
                        + Tambah Mata Kuliah
                    </button>
                </div>

                {/* Table Container */}
                {loading ? (
                    <p className="text-gray-500 text-center">Loading...</p>
                ) : (
                    <div className="rounded-lg border border-gray-200 max-h-[65vh] overflow-y-auto overflow-x-auto">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-[#ecfafa] text-[#0db0bb] font-semibold">
                            <tr>
                                <th className="p-3 border-b">ID</th>
                                <th className="p-3 border-b">Nama Mata Kuliah</th>
                                <th className="p-3 border-b">Semester</th>
                                <th className="p-3 border-b">Aksi</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredMatkul.length > 0 ? (
                                filteredMatkul.map((matkul) => (
                                    <tr key={matkul.id_matkul} className="border-b hover:bg-gray-50 transition">
                                        <td className="p-3">{matkul.id}</td>
                                        <td className="p-3">{matkul.nama_matkul}</td>
                                        <td className="p-3">{matkul.semester}</td>
                                        <td className="p-3">
                                            <button
                                                className="bg-[#0db0bb] text-white px-3 py-1 rounded-md hover:bg-[#0aa2a8] text-xs"
                                                onClick={() => openEditModal(matkul)}
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-6 text-gray-500">
                                        Tidak ada data ditemukan.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                )}

            {/* Modal Tambah */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <form
                        onSubmit={handleSubmitAdd}
                        className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 shadow-lg"
                    >
                        <h2 className="text-xl font-semibold text-center">Tambah Mata Kuliah</h2>
                        <input
                            type="text"
                            name="id"
                            placeholder="ID Mata Kuliah (contoh: IN622)"
                            value={formData.id}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0db0bb]"
                            required
                        />
                        <input
                            type="text"
                            name="nama_matkul"
                            placeholder="Nama Mata Kuliah"
                            value={formData.nama_matkul}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0db0bb]"
                            required
                        />
                        <input
                            type="number"
                            name="semester"
                            placeholder="Semester"
                            value={formData.semester}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0db0bb]"
                            required
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                                onClick={() => setShowAddModal(false)}
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-[#0db0bb] text-white rounded-lg hover:bg-[#0aa2a8]"
                            >
                                Simpan
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Modal Edit */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <form
                        onSubmit={handleSubmitEdit}
                        className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 shadow-lg"
                    >
                        <h2 className="text-xl font-semibold text-center">Edit Mata Kuliah</h2>
                        <input
                            type="text"
                            name="id"
                            value={formData.id}
                            readOnly
                            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                        />
                        <input
                            type="text"
                            name="nama_matkul"
                            placeholder="Nama Mata Kuliah"
                            value={formData.nama_matkul}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0db0bb]"
                            required
                        />
                        <input
                            type="number"
                            name="semester"
                            placeholder="Semester"
                            value={formData.semester}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0db0bb]"
                            required
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                                onClick={() => setShowEditModal(false)}
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-[#0db0bb] text-white rounded-lg hover:bg-[#0aa2a8]"
                            >
                                Simpan
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AllCourse;
