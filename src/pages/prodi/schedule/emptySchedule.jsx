import React from "react";
import { useScheduleSystem } from "../../../hooks/prodi/useScheduleSystem.jsx";
import { useCheckDosenAvailability } from "../../../hooks/prodi/useCheckDosenAvailability.jsx";

const EmptySchedule = () => {
    const { generateAndAddSchedule } = useScheduleSystem();
    const { emptySchedule } = useCheckDosenAvailability();

    return (
        <div className="text-center space-y-6">
            <p className="text-gray-700 text-lg">Belum ada jadwal pada periode ini.</p>

            <button
                onClick={generateAndAddSchedule}
                className="bg-[#0db0bb] text-white px-6 py-2 rounded-lg hover:bg-[#0aa2a8] transition"
            >
                Generate Jadwal Sekarang
            </button>

            {emptySchedule.length > 0 && (
                <div className="mt-4 px-4 py-3 rounded-lg bg-yellow-100/60 text-left max-w-xl mx-auto">
                    <p className="text-yellow-800 font-semibold mb-2">
                        Dosen yang belum mengisi jadwal:
                    </p>

                    <div className="max-h-40 overflow-y-auto pr-2 ">
                        <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
                            {emptySchedule.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmptySchedule;
