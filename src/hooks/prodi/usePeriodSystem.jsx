import { useState, useEffect } from "react";
import { fetchAllPeriode, setActivePeriode, addPeriode, editPeriode } from "../../api/prodi/periodeService";
import Swal from "sweetalert2";

export const usePeriodeSystem = () => {
    const [periodes, setPeriodes] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPeriodes = async () => {
        try {
            setLoading(true);
            const res = await fetchAllPeriode();
            setPeriodes(res.result || []);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleSetActive = async (periodeId) => {
        try {
            await setActivePeriode(periodeId);
            await fetchPeriodes();
            Swal.fire("Berhasil", "Periode berhasil diaktifkan", "success");
        } catch (error) {
            Swal.fire("Gagal", "Gagal mengaktifkan periode", "error",error);
            console.log(error)
        }
    };

    const handleAddPeriode = async () => {
        const { value: nama } = await Swal.fire({
            title: "Tambah Periode Baru",
            input: "text",
            inputPlaceholder: "Contoh: GNJL2025/2026",
            showCancelButton: true,
            confirmButtonColor: "#0db0bb",
            cancelButtonColor: "#d33",
            confirmButtonText: "Tambah",
            cancelButtonText: "Batal",
        });

        if (nama) {
            try {
                await addPeriode(nama);
                await fetchPeriodes();
                Swal.fire("Berhasil", "Periode baru berhasil ditambahkan", "success");
            } catch (error) {
                Swal.fire("Gagal", "Gagal menambahkan periode", "error",error);
            }
        }
    };

    const handleEditPeriode = async (periode) => {
        const { value: newName } = await Swal.fire({
            title: "Edit Nama Periode",
            input: "text",
            inputValue: periode.nama,
            showCancelButton: true,
            confirmButtonColor: "#0db0bb",
            cancelButtonColor: "#d33",
            confirmButtonText: "Simpan",
            cancelButtonText: "Batal",
        });

        if (newName && newName !== periode.nama) {
            try {
                await editPeriode(periode.id, newName);
                await fetchPeriodes();
                Swal.fire("Berhasil", "Nama periode berhasil diubah", "success");
            } catch (error) {
                Swal.fire("Gagal", "Gagal mengubah nama periode", "error",error);
            }
        }
    };

    useEffect(() => {
        fetchPeriodes();
    }, []);

    return {
        periodes,
        loading,
        handleSetActive,
        handleAddPeriode,
        handleEditPeriode,
    };
};
