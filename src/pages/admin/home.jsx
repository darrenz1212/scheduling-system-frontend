import React, { useState } from "react";
import AdminNav from './adminNav.jsx';
import DosenList from './dosenList.jsx';
import ProdiList from "./prodiList.jsx";
import { useUserAdmin } from "../../hooks/admin/useUserAdmin.js";

export default function AdminHome() {
    const {
        users,
        loading,
        error,
        openAddModal,
        showModal,
        form,
        prodiList,
        handleChange,
        handleSubmit,
        closeModal,
    } = useUserAdmin();

    const [tab, setTab] = useState("dosen");

    return (
        <div className="flex min-h-screen bg-gray-100">
            <AdminNav />
            <div className="ml-auto mr-20 w-8/12 max-w-7xl bg-white shadow-lg rounded-lg p-6 mt-5">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Daftar Semua User</h2>

                <div className="flex justify-between items-center border-b border-gray-300 mb-6">
                    <div>
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
                        <button
                            onClick={openAddModal}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            + Tambah Dosen
                        </button>
                </div>

                {loading && <p className="text-center text-gray-500">Memuat data...</p>}
                {error && <p className="text-center text-red-500">Terjadi kesalahan saat memuat data.</p>}

                {!loading && !error && (
                    <div className="transition-opacity duration-300">
                        {tab === "dosen" && <DosenList users={users} />}
                        {tab === "prodi" && <ProdiList users={users} />}
                    </div>
                )}

                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">
                                Tambah User
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium">User ID</label>
                                    <input
                                        type="text"
                                        name="user_id"
                                        value={form.user_id}
                                        onChange={handleChange}
                                        className="mt-1 p-2 w-full border rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={form.username}
                                        onChange={handleChange}
                                        className="mt-1 p-2 w-full border rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        className="mt-1 p-2 w-full border rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">Role</label>
                                    <select
                                        name="role"
                                        value={form.role}
                                        onChange={handleChange}
                                        className="mt-1 p-2 w-full border rounded"
                                    >
                                        <option value={1}>Admin</option>
                                        <option value={2}>Prodi</option>
                                        <option value={3}>Dosen</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">Prodi</label>
                                    <select
                                        name="prodi"
                                        value={form.prodi}
                                        onChange={handleChange}
                                        className="mt-1 p-2 w-full border rounded"
                                    >
                                        <option value="">-- Pilih Prodi --</option>
                                        {prodiList.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.nama_prodi}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">Status</label>
                                    <select
                                        name="status"
                                        value={form.status ? "true" : "false"}
                                        onChange={(e) =>
                                            handleChange({
                                                target: {
                                                    name: "status",
                                                    value: e.target.value === "true",
                                                },
                                            })
                                        }
                                        className="mt-1 p-2 w-full border rounded"
                                    >
                                        <option value="true">Aktif</option>
                                        <option value="false">Tidak Aktif</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 mr-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
