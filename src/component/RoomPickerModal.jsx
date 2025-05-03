import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../axiosConfig";

const RoomPickerModal = ({ jadwal, onClose, onSave }) => {
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(jadwal.ruangan_id);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await api.get('/api/ruangan');
                setRooms(res.data.data || []);
            } catch (err) {
                console.error("Error fetching ruangan:", err);
                Swal.fire({ icon: "error", title: "Gagal ambil daftar ruangan" });
                onClose();
            }
        };
        fetchRooms();
    }, []);

    const handleSave = () => {
        onSave(selectedRoom);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                <h3 className="text-lg font-semibold mb-4">Ubah Ruangan</h3>
                <select
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    value={selectedRoom}
                    onChange={e => setSelectedRoom(e.target.value)}
                >
                    {rooms.map(r => (
                        <option key={r.id} value={r.id}>
                            {r.nama_ruangan}
                        </option>
                    ))}
                </select>
                <div className="flex justify-end">
                    <button
                        className="px-4 py-2 mr-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                        onClick={onClose}
                    >
                        Batal
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        onClick={handleSave}
                        disabled={selectedRoom === jadwal.ruangan_id}
                    >
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomPickerModal;
