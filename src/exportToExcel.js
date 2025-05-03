import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportScheduleToExcel = (events) => {
    if (!events || events.length === 0) {
        console.error("Tidak ada data untuk diekspor");
        return;
    }

    const periodeName = events[0]?.meta?.MatkulAktif?.Periode?.nama || "Periode";

    let formattedData = events.map((event) => {
        const meta = event.meta || {};
        const matkul = meta.MatkulAktif || {};
        const mk = matkul.MataKuliah || {};
        const user = matkul.User || {};
        const ruangan = meta.Ruangan || {};

        return {
            _sort_id: parseInt(matkul.id) || 0,
            "ID Mata Kuliah": matkul.id_matkul || "-",
            "Mata Kuliah": mk.nama_matkul || "-",
            "Nama Dosen": user.username || "-",
            "Kelas": matkul.kelas || "-",
            "Semester": mk.semester || "-",
            "Jenis": matkul.praktikum ? "Praktikum" : "Teori",
            "Hari": ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"][meta.hari] || "-",
            "Jam Mulai": meta.jam_mulai || "-",
            "Jam Selesai": meta.jam_selesai || "-",
            "Ruangan": ruangan.nama_ruangan || "-",
            "Periode": matkul.Periode?.nama || "-"
        };


    });

    formattedData.sort((a, b) => a._sort_id - b._sort_id);

    formattedData = formattedData.map(({ _sort_id, ...rest }) => rest);

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jadwal");

    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array"
    });

    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `Plot Jadwal (${periodeName}).xlsx`);
};
