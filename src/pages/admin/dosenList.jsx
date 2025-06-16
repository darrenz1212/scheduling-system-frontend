import React from "react";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { useUserAdmin } from "../../hooks/admin/useUserAdmin.js";

export default function DosenList({ users }) {
    const {
        prodiList,
        form,
        showModal,
        isEditMode,
        handleChange,
        openEditModal,
        closeModal,
        handleSubmit,
    } = useUserAdmin();

    const dosenList = users.filter((user) => user.role.name === "Dosen");

    return (
        <div>
            <table className="min-w-full table-auto border border-gray-200">
                <thead className="bg-gray-200 text-gray-700">
                <tr>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Username</th>
                    <th className="px-4 py-2 text-left">Prodi</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Aksi</th>
                </tr>
                </thead>
                <tbody>
                {dosenList.map((user) => (
                    <tr key={user.user_id} className={`border-t ${user.status !== "Aktif" ? "text-gray-400" : ""}`}>
                        <td className="px-4 py-2">{user.user_id}</td>
                        <td className="px-4 py-2">{user.username}</td>
                        <td className="px-4 py-2">{user.prodi.nama_prodi}</td>
                        <td className="px-4 py-2">{user.status}</td>
                        <td className="px-4 py-2">
                            <button onClick={() => openEditModal(user)}>
                                <PencilSquareIcon className="h-5 w-5 text-blue-500 hover:text-blue-700" />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">
                            {isEditMode ? "Edit Dosen" : "Tambah Dosen"}
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">User ID</label>
                                <input
                                    type="text"
                                    name="user_id"
                                    value={form.user_id}
                                    onChange={handleChange}
                                    disabled={isEditMode}
                                    className="mt-1 p-2 w-full border rounded bg-gray-100"
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
                            {!isEditMode && (
                                <>
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
                                </>
                            )}
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
                                        handleChange({ target: { name: "status", value: e.target.value === "true" } })
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
    );
}
