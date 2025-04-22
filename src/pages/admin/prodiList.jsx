import React from "react";

export default function ProdiList({ users }) {
    const prodiList = users.filter(user => user.role.name === "Prodi");

    return (
        <div className="mt-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Prodi</h3>
            <div className="overflow-x-auto">
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
                    {prodiList.map((user) => (
                        <tr
                            key={user.user_id}
                            className={`border-t border-gray-200 ${user.status !== "Aktif" ? "text-gray-400" : ""}`}
                        >
                            <td className="px-4 py-2">{user.user_id}</td>
                            <td className="px-4 py-2">{user.username}</td>
                            <td className="px-4 py-2">{user.prodi.nama_prodi}</td>
                            <td className="px-4 py-2">{user.status}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
