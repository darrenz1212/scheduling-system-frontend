import React, { useState } from "react";
import AdminNav from './adminNav.jsx';
import DosenList from './dosenList.jsx';
import ProdiList from "./prodiList.jsx";
import { useUserAdmin } from "../../hooks/admin/useUserAdmin.js";

export default function AdminHome() {
    const { users, loading, error } = useUserAdmin();
    const [tab, setTab] = useState("dosen");

    return (
        <div className="flex min-h-screen bg-gray-100">
            <AdminNav />
            <div className="ml-auto mr-20 w-8/12 max-w-7xl bg-white shadow-lg rounded-lg p-6 mt-5">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Daftar Semua User</h2>

                <div className="flex border-b border-gray-300 mb-6">
                    <button
                        onClick={() => setTab("dosen")}
                        className={`px-4 py-2 font-medium transition border-b-2 ${
                            tab === "dosen"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-600 hover:text-blue-500"
                        }`}
                    >
                        Dosen
                    </button>
                    <button
                        onClick={() => setTab("prodi")}
                        className={`px-4 py-2 font-medium transition border-b-2 ml-4 ${
                            tab === "prodi"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-600 hover:text-blue-500"
                        }`}
                    >
                        Prodi
                    </button>
                </div>

                {loading && <p className="text-center text-gray-500">Memuat data...</p>}
                {error && <p className="text-center text-red-500">Terjadi kesalahan saat memuat data.</p>}

                {!loading && !error && (
                    <div className="transition-opacity duration-300">
                        {tab === "dosen" && <DosenList users={users}/>}
                        {tab === "prodi" && <ProdiList users={users}/>}
                    </div>
                )}
            </div>
        </div>
    );
}
