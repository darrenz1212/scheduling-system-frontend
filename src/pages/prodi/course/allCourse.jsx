import React from "react";
import ProdiNav from "../prodiNav.jsx";
import { useAllCourse } from "../../../hooks/prodi/course/useAllCourse.jsx";

const AllCourse = () => {
    const { matkulList, loading } = useAllCourse();

    return (
        <div className="flex bg-gray-100 min-h-screen w-full">
            <ProdiNav />

            <div className="flex flex-col w-full bg-white shadow-lg rounded-none p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">List Mata Kuliah</h2>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                        + Tambah Mata Kuliah
                    </button>
                </div>

                {/* Table Container */}
                {loading ? (
                    <p className="text-gray-500 text-center">Loading...</p>
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-blue-50 text-blue-800 font-semibold">
                            <tr>
                                <th className="p-3 border-b">ID</th>
                                <th className="p-3 border-b">Nama Mata Kuliah</th>
                                <th className="p-3 border-b">Semester</th>
                            </tr>
                            </thead>
                            <tbody>
                            {matkulList.map((matkul) => (
                                <tr key={matkul.id_matkul} className="border-b hover:bg-gray-50 transition">
                                    <b>
                                        <td className="p-3">{matkul.id}</td>
                                    </b>
                                    <td className="p-3">{matkul.nama_matkul}</td>
                                    <td className="p-3">{matkul.semester}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );

};

export default AllCourse;
