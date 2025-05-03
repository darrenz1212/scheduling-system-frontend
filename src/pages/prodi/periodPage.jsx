import React from "react";
import ProdiNav from "../prodi/prodiNav.jsx";
import { usePeriodeSystem } from "../../hooks/prodi/usePeriodSystem.jsx";

const PeriodePage = () => {
    const { periodes, loading, handleSetActive, handleAddPeriode, handleEditPeriode } = usePeriodeSystem();

    return (
        <div className="flex flex-col w-full h-screen bg-gray-100 p-6 relative">
            <ProdiNav />
            <div className="ml-auto mr-20 w-8/12 max-w-6xl bg-white shadow-lg rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Manajemen Periode</h2>
                    <button
                        onClick={handleAddPeriode}
                        className="bg-[#0db0bb] text-white px-4 py-2 rounded-lg hover:bg-[#0aa2a8] transition text-sm"
                    >
                        Tambah Periode
                    </button>
                </div>

                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : (
                    <table className="w-full table-auto border border-gray-300 rounded-lg">
                        <thead className="bg-gray-200">
                        <tr>
                            <th className="py-2 px-4 border">Nama Periode</th>
                            <th className="py-2 px-4 border">Status</th>
                            <th className="py-2 px-4 border">Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                        {periodes.map((periode) => (
                            <tr key={periode.id} className="text-center">
                                <td className="py-2 px-4 border">{periode.nama}</td>
                                <td className="py-2 px-4 border">
                                    {periode.active ? (
                                        <span className="text-green-600 font-semibold">Aktif</span>
                                    ) : (
                                        <span className="text-gray-500">Tidak Aktif</span>
                                    )}
                                </td>
                                <td className="py-2 px-4 border space-x-2">
                                    {!periode.active && (
                                        <button
                                            onClick={() => handleSetActive(periode.id)}
                                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs"
                                        >
                                            Set Aktif
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleEditPeriode(periode)}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default PeriodePage;
