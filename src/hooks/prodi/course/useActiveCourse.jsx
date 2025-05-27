import { useEffect, useState } from "react";
import { fetchMatkulAktif, AddMatkul, updateMatkul, deleteMatkul} from "../../../api/course/matkulAktif.js";
import { fetchAllPeriode } from "../../../api/periodeService";
import {fetchDosenList} from "../../../api/course/matkulAktif.js";
import Swal from 'sweetalert2';
import { useSelector } from "react-redux";

export const useActiveCourse = () => {
    const [periodeList, setPeriodeList] = useState([]);
    const [selectedPeriode, setSelectedPeriode] = useState("");
    const [activeMatkulList, setActiveMatkulList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingAdd, setLoadingAdd] = useState(false);
    const [errorAdd, setErrorAdd] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [dosenList, setDosenList] = useState([]);
    const user = useSelector((state) => state.auth.user);


    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        id_matkul: "",
        sks: "",
        praktikum: false,
        dosen: "",
        kelas: "",
    });

    useEffect(() => {
        const getPeriode = async () => {
            try {
                const data = await fetchAllPeriode();
                const sorted = (data.result || []).sort((a, b) => b.active - a.active);
                setPeriodeList(sorted);
                if (sorted.length > 0) {
                    setSelectedPeriode(sorted[0].id);
                }
            } catch (err) {
                console.error("Gagal ambil list periode", err);
            }
        };
        getPeriode();
    }, []);

    useEffect(() => {
        if (!selectedPeriode) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await fetchMatkulAktif(user.prodi);
                setActiveMatkulList(data);
            } catch (err) {
                console.error("Gagal fetch matkul aktif", err);
                setActiveMatkulList([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedPeriode]);

    const addActiveCourse = async (payload) => {
        setLoadingAdd(true);
        setErrorAdd(null);
        try {
            const response = await AddMatkul(payload);
            const updated = await fetchMatkulAktif(selectedPeriode);
            setActiveMatkulList(updated);
            return response;
        } catch (error) {
            setErrorAdd(error);
            throw error;
        } finally {
            setLoadingAdd(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            periode: selectedPeriode,
        };
        try {
            await addActiveCourse(payload);
            setShowAddModal(false);
            setFormData({
                id_matkul: "",
                sks: "",
                praktikum: false,
                dosen: "",
                kelas: "",
            });
        } catch (error) {
            console.error("Error adding course:", error);
        }
    };

    const openEditModal = async (matkul) => {
        setEditData(matkul);
        try {
            const dosenData = await fetchDosenList();
            setDosenList(dosenData);
            setEditModalOpen(true);
        } catch (err) {
            console.error("Gagal fetch dosen untuk edit", err);
        }
    };

    const updateMatkulDosen = async () => {
        try {
            const payload = {
                id_matkul: editData.id_matkul,
                sks: editData.sks,
                praktikum: editData.praktikum,
                dosen: editData.dosen,
                kelas: editData.kelas,
                periode: selectedPeriode
            };


            await updateMatkul(editData.id, payload);

            const updated = await fetchMatkulAktif(selectedPeriode);
            setActiveMatkulList(updated);
            setEditModalOpen(false);

            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Dosen pengampu berhasil diperbarui.',
                confirmButtonColor: '#0db0bb'
            });
        } catch (err) {
            console.error("Gagal update dosen", err); // ERROR LOG
        }
    };

    const handleDeleteMatkul = async (id) =>{
        const confirmation = await Swal.fire({
            title: "Yakin ingin menghapus?",
            text: "Data mata kuliah ini akan dihapus secara permanen.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#f23b2e",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Ya, hapus",
            cancelButtonText: "Batal"
        })
        if (confirmation.isConfirmed) {
            try {
                await deleteMatkul(id);
                Swal.fire({
                    icon: "success",
                    title: "Terhapus!",
                    text: "Data mata kuliah berhasil dihapus.",
                    confirmButtonColor: "#0db0bb"
                });

                // Refresh data setelah delete
                setSelectedPeriode((prev) => {
                    // trigger useEffect agar fetch ulang
                    return `${prev}`; // force rerender
                });
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Gagal!",
                    text: "Terjadi kesalahan saat menghapus data.",
                });
            }
        }
    }





    return {
        activeMatkulList,
        periodeList,
        selectedPeriode,
        setSelectedPeriode,
        loading,
        addActiveCourse,
        loadingAdd,
        errorAdd,
        showAddModal,
        setShowAddModal,
        formData,
        setFormData,
        handleInputChange,
        handleSubmit,
        editModalOpen,
        setEditModalOpen,
        editData,
        setEditData,
        openEditModal,
        updateMatkulDosen,
        dosenList,
        handleDeleteMatkul
    };
};
