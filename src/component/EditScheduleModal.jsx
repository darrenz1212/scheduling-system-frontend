import React, { useState, useEffect } from "react";
// import dayjs from "dayjs";

const DAY_NAMES = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];

export default function EditScheduleModal({
                                              open,
                                              data,
                                              availabilityRanges = [],
                                              ruanganList = [],
                                              busyEvents = [],
                                              sks = 2,
                                              onClose,
                                              onSave
                                          }) {
    const [hari, setHari]             = useState(data?.hari ?? 0);
    const [jamMulai, setJamMulai]     = useState(data?.jam_mulai ?? "");
    const [jamSelesai, setJamSelesai] = useState(data?.jam_selesai ?? "");
    const [ruanganId, setRuanganId]   = useState(data?.ruangan_id ?? null);

    useEffect(() => {
        if (open && data) {
            setHari(data.hari);
            setJamMulai(data.jam_mulai);
            setJamSelesai(data.jam_selesai);
            setRuanganId(data.ruangan_id);
        }
    }, [open, data]);

    if (!open || !data) return null;

    const safeAvail = Array.isArray(availabilityRanges) ? availabilityRanges : [];
    const slots = safeAvail.filter(
        s => Array.isArray(s.daysOfWeek) && s.daysOfWeek[0] === hari
    );
    const timeOptions = Array.isArray(slots)
        ? slots.map(s => ({ start: s.startTime, end: s.endTime }))
        : [];

    const durasiMenit = sks * 50;

    const isBentrok = (start, end, exceptId = null) =>
        busyEvents.some(ev =>
            ev.hari === hari &&
            ev.ruangan_id === ruanganId &&
            !(end <= ev.jam_mulai || start >= ev.jam_selesai) &&
            ev.id_jadwal_kuliah !== exceptId
        );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <h3 className="text-lg font-semibold mb-4">Edit Jadwal</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Hari</label>
                        <select
                            value={hari}
                            onChange={e => setHari(+e.target.value)}
                            className="w-full border rounded p-2"
                        >
                            {DAY_NAMES.map((nama, idx) => (
                                <option key={idx} value={idx}>{nama}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Jam Mulai</label>
                        <select
                            value={jamMulai}
                            onChange={e => {
                                const val = e.target.value;
                                setJamMulai(val);
                                const match = timeOptions.find(t => t.start === val);
                                setJamSelesai(match?.end || "");
                            }}
                            className="w-full border rounded p-2"
                        >
                            {timeOptions.length === 0 ? (
                                <option value="">Tidak tersedia</option>
                            ) : (
                                timeOptions.map((opt, i) => (
                                    <option key={i} value={opt.start} disabled={opt.disabled}>
                                        {opt.start} {opt.disabled ? "- Bentrok" : ""}
                                    </option>
                                ))
                            )}
                        </select>

                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Jam Selesai</label>
                        <input
                            type="text"
                            value={jamSelesai}
                            readOnly
                            className="w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Ruangan</label>
                        <select
                            value={ruanganId}
                            onChange={e => setRuanganId(+e.target.value)}
                            className="w-full border rounded p-2"
                        >
                            {ruanganList.map(r => {
                                const conflict = isBentrok(jamMulai, jamSelesai, data?.id_jadwal_kuliah) && r.id === ruanganId;
                                return (
                                    <option key={r.id} value={r.id} className={conflict ? "text-red-500" : ""}>
                                        {r.nama_ruangan}{conflict ? " - *Sudah terpakai" : ""}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Batal
                    </button>
                    <button
                        onClick={() =>
                            onSave({
                                id: data.id_jadwal_kuliah,
                                hari,
                                jam_mulai: jamMulai,
                                jam_selesai: jamSelesai,
                                ruangan_id: ruanganId
                            })
                        }
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    );
}
