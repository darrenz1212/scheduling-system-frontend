import React from "react";
import ProdiNav from "../prodiNav.jsx";
import { useActiveCourse } from "../../../hooks/prodi/course/useActiveCourse.jsx";
import AddPeriodWizard from "../../../component/prodi/addPeriodWizard.jsx";
// import {useSelector} from "react-redux";

const ActiveCourse = () => {
    const {
        activeMatkulList,
        loading,
        periodeList,
        selectedPeriode,
        setSelectedPeriode,
        showAddModal,
        setShowAddModal,
    } = useActiveCourse();

    return (
        <div className="flex bg-gray-100 min-h-screen w-full">
            <ProdiNav />
            <div className="flex flex-col w-full bg-white shadow-lg rounded-none p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold">Mata Kuliah Aktif Periode</h2>
                        <select
                            value={selectedPeriode}
                            onChange={(e) => setSelectedPeriode(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            {periodeList.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.nama}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                            onClick={() => setShowAddModal(true)}
                        >
                            Tambah Periode
                        </button>
                    </div>
                </div>

                {loading ? (
                    <p className="text-gray-500 text-center">Loading...</p>
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-blue-50 text-blue-800 font-semibold">
                            <tr>
                                <th className="p-3 border-b">ID Matkul</th>
                                <th className="p-3 border-b">Nama</th>
                                <th className="p-3 border-b">SKS</th>
                                <th className="p-3 border-b">Kelas</th>
                                <th className="p-3 border-b">Semester</th>
                                <th className="p-3 border-b">Dosen</th>
                                <th className="p-3 border-b">Periode</th>
                                <th>
                                    Action
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {activeMatkulList.map((item) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="p-6">{item.id_matkul}</td>
                                    <td className="p-3">
                                        {item.MataKuliah?.nama_matkul}
                                        {item.praktikum && <strong> (Praktikum)</strong>}
                                    </td>
                                    <td className="p-3">{item.sks}</td>
                                    <td className="p-3">{item.kelas}</td>
                                    <td className="p-3">{item.MataKuliah?.semester}</td>
                                    <td className="p-3">{item.User?.username}</td>
                                    <td className="p-3">{item.Periode?.nama}</td>
                                    <td>
                                        <button
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {showAddModal && <AddPeriodWizard setShowAddModal={setShowAddModal} />}

        </div>
    );
};

export default ActiveCourse;
