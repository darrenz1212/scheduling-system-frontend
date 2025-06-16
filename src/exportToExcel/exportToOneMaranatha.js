import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const ExportToOneMaranatha = (events) => {
    if (!events || events.length === 0) {
        console.error("Tidak ada data untuk diekspor");
        return;
    }

    // Helper untuk format jam: "08:00:00" → "08.00"
    const formatJam = (timeStr) =>
        timeStr?.substr(0, 5).replace(":", ".") || "";

    // Hitung KodeSubKelas per matkul+kelas
    const subKelasCounter = {};

    // Urutkan supaya subKelasCounter konsisten
    const sorted = [...events].sort((a, b) => {
        const ma = a.meta.MatkulAktif, mb = b.meta.MatkulAktif;
        if (ma.id_matkul < mb.id_matkul) return -1;
        if (ma.id_matkul > mb.id_matkul) return 1;
        return (ma.kelas || "").localeCompare(mb.kelas || "");
    });

    const rows = sorted.map((event) => {
        const meta = event.meta || {};
        const matkulAktif = meta.MatkulAktif || {};
        const mk = matkulAktif.MataKuliah || {};
        const ruang = meta.Ruangan || {};

        const key = `${matkulAktif.id_matkul}-${matkulAktif.kelas}`;

        // Tentukan KodeSubKelas
        let kodeSub;
        if (!matkulAktif.praktikum) {
            kodeSub = 1;
        } else {
            // misal: pertama → 2, kedua → 3, dst.
            subKelasCounter[key] = (subKelasCounter[key] || 1) + 1;
            kodeSub = subKelasCounter[key];
        }

        // JmlRencanaTm: praktikum=14, teori=16
        const jmlRencana = matkulAktif.praktikum ? 14 : 16;

        // Hitung SKSTatapMuka: teori 1SKS→2, praktikum 1SKS→4
        const sks = mk.sks || 0;
        const multiplier = matkulAktif.praktikum ? 4 : 2;
        const sksTatapMuka = sks * multiplier;

        return {
            KodeMK: matkulAktif.id_matkul || "",
            NamaMK: mk.nama_matkul || "",
            MaxJumlahMhs: mk.maxJumlahMhs ?? mk.max_jumlah_mhs ?? "",
            KodeKelas: matkulAktif.kelas || "",
            KodeSubKelas: kodeSub,
            JmlRencanaTm: jmlRencana,
            SKSTatapMuka: sksTatapMuka,
            Hari: meta.hari ?? "",
            JamAwal: formatJam(meta.jam_mulai),
            JamAkhir: formatJam(meta.jam_selesai),
            Ruang: ruang.nama_ruangan || ruang.kode || "",
            WaktuKuliah: 1,            // default
            ModeKuliah: "F",           // default offline
            Lingkup: 1,                // default internal
            Bahasa: mk.bahasa || "",   // sesuaikan field di data Anda
            KelasKampusMerdeka: 0      // default
        };
    });

    // Pastikan urutan kolom sesuai template
    const headers = [
        "KodeMK","NamaMK","MaxJumlahMhs","KodeKelas","KodeSubKelas",
        "JmlRencanaTm","SKSTatapMuka","Hari","JamAwal","JamAkhir",
        "Ruang","WaktuKuliah","ModeKuliah","Lingkup","Bahasa","KelasKampusMerdeka"
    ];

    const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `Jadwal_One_Maranatha.xlsx`);
};
