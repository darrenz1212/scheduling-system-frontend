import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export default function EditScheduleModal({
                                              open,
                                              data,
                                              availabilityRanges = [],
                                              ruanganList = [],
                                              getBusyEvents = () => [],
                                              onClose,
                                              onSave
                                          }) {
    const [hari, setHari] = useState(data?.hari ?? 0);
    const [jamMulai, setJamMulai] = useState(data?.jam_mulai ?? "");
    const [jamSelesai, setJamSelesai] = useState(data?.jam_selesai ?? "");
    const [ruanganId, setRuanganId] = useState(data?.ruangan_id ?? null);

    const sksMatkul = data?.MatkulAktif?.sks || 0;
    const isPraktikum = data?.MatkulAktif?.praktikum || false;

    useEffect(() => {
        if (open && data) {
            setHari(data.hari);
            const currentJamMulai = data.jam_mulai || "";
            setJamMulai(currentJamMulai);
            setRuanganId(data.ruangan_id);

            if (currentJamMulai && sksMatkul > 0) {
                const durasiMenit = sksMatkul * (isPraktikum ? 120 : 50);
                const [hours, minutes, seconds] = currentJamMulai.split(':').map(Number);
                const jamMulaiObj = dayjs().hour(hours).minute(minutes).second(seconds);
                const jamSelesaiObj = jamMulaiObj.add(durasiMenit, 'minutes');
                setJamSelesai(jamSelesaiObj.format('HH:mm:ss'));
            } else {
                setJamSelesai(data.jam_selesai || "");
            }
        }
    }, [open, data, sksMatkul, isPraktikum]);

    if (!open || !data) return null;

    const handleJamMulaiChange = (e) => {
        const newJamMulai = e.target.value;
        setJamMulai(newJamMulai);

        if (newJamMulai && sksMatkul > 0) {
            const durasiMenit = sksMatkul * (isPraktikum ? 120 : 50);
            const [hours, minutes, seconds] = newJamMulai.split(':').map(Number);
            const jamMulaiObj = dayjs().hour(hours).minute(minutes).second(seconds);
            const jamSelesaiObj = jamMulaiObj.add(durasiMenit, 'minutes');
            setJamSelesai(jamSelesaiObj.format('HH:mm:ss'));
        } else {
            setJamSelesai("");
        }
    };

    const safeAvail = Array.isArray(availabilityRanges) ? availabilityRanges : [];
    const slotsForSelectedDay = safeAvail.filter(
        s => Array.isArray(s.daysOfWeek) && s.daysOfWeek[0] === hari
    );

    const busyEvents =
        typeof getBusyEvents === "function"
            ? getBusyEvents(hari)
            : Array.isArray(getBusyEvents)
                ? getBusyEvents
                : [];

    const timeOptions = slotsForSelectedDay.reduce((acc, slot) => {
        const durasiMenitTotal = sksMatkul * (isPraktikum ? 120 : 50);
        let currentTime = dayjs(`2000-01-01T${slot.startTime}`);
        const slotEndTime = dayjs(`2000-01-01T${slot.endTime}`);

        while(currentTime.add(durasiMenitTotal, 'minutes').isBefore(slotEndTime) || currentTime.add(durasiMenitTotal, 'minutes').isSame(slotEndTime)) {
            const optionValue = currentTime.format('HH:mm:ss');
            const optionEndTime = currentTime.add(durasiMenitTotal, 'minutes').format('HH:mm:ss');

            const isOptionBentrok = busyEvents.some(ev =>
                ev.hari === hari &&
                !(dayjs(`2000-01-01T${optionEndTime}`).isSameOrBefore(dayjs(`2000-01-01T${ev.jam_mulai}`)) ||
                    dayjs(`2000-01-01T${optionValue}`).isSameOrAfter(dayjs(`2000-01-01T${ev.jam_selesai}`))) &&
                ev.id_jadwal_kuliah !== data.id_jadwal_kuliah
            );

            acc.push({
                value: optionValue,
                label: `${optionValue} - ${optionEndTime}`,
                disabled: isOptionBentrok
            });
            currentTime = currentTime.add(30, 'minutes');
        }
        return acc;
    }, []);


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <h3 className="text-lg font-semibold mb-4">Edit Jadwal - {data.MatkulAktif?.MataKuliah?.nama_matkul} ({sksMatkul} SKS {isPraktikum ? "Praktikum" : "Teori"})</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Hari</label>
                        <select
                            value={hari}
                            onChange={e => {
                                setHari(+e.target.value);
                                setJamMulai("");
                                setJamSelesai("");
                            }}
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
                            onChange={handleJamMulaiChange}
                            className="w-full border rounded p-2"
                        >
                            <option value="">Pilih Jam Mulai</option>
                            {timeOptions.length === 0 ? (
                                <option value="" disabled>Tidak ada slot tersedia</option>
                            ) : (
                                timeOptions.map((opt, i) => (
                                    <option key={i} value={opt.value} disabled={opt.disabled}>
                                        {opt.label} {opt.disabled ? "- Bentrok" : ""}
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
                            value={ruanganId || ""}
                            onChange={e => setRuanganId(e.target.value ? +e.target.value : null)}
                            className="w-full border rounded p-2"
                        >
                            <option value="">Pilih Ruangan</option>
                            {ruanganList.map(r => {
                                const currentEndTime = jamMulai && sksMatkul > 0
                                    ? dayjs(`2000-01-01T${jamMulai}`).add(sksMatkul * (isPraktikum ? 120 : 50), 'minutes').format('HH:mm:ss')
                                    : null;

                                const conflict = currentEndTime && busyEvents.some(ev =>
                                    ev.hari === hari &&
                                    ev.ruangan_id === r.id &&
                                    !(dayjs(`2000-01-01T${currentEndTime}`).isSameOrBefore(dayjs(`2000-01-01T${ev.jam_mulai}`)) ||
                                        dayjs(`2000-01-01T${jamMulai}`).isSameOrAfter(dayjs(`2000-01-01T${ev.jam_selesai}`))) &&
                                    ev.id_jadwal_kuliah !== data.id_jadwal_kuliah
                                );
                                return (
                                    <option key={r.id} value={r.id} className={conflict ? "text-red-500 font-bold" : ""}>
                                        {r.nama_ruangan}{conflict ? " - Bentrok pada waktu ini" : ""}
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
                                id_jadwal_kuliah: data.id_jadwal_kuliah,
                                hari,
                                jam_mulai: jamMulai,
                                jam_selesai: jamSelesai,
                                ruangan_id: ruanganId
                            })
                        }
                        disabled={!jamMulai || !jamSelesai || !ruanganId}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    );
}