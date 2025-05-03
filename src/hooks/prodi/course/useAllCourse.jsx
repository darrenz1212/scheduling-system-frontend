import { fetchAllMatkul, addMatkul, editMatkul } from "../../../api/course/allCourseService.js";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
export const useAllCourse = () => {
    const [matkulList, setMatkulList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        nama_matkul: "",
        semester: "",
    });

    const getMatkul = async () => {
        try {
            const result = await fetchAllMatkul();
            setMatkulList(result.result || []);
        } catch (err) {
            console.error("Failed to fetch all matkul", err);
            setMatkulList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMatkul();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const openEditModal = (matkul) => {
        setFormData({
            id: matkul.id,
            nama_matkul: matkul.nama_matkul,
            semester: matkul.semester,
        });
        setShowEditModal(true);
    };

    const handleSubmitAdd = async (e) => {
        e.preventDefault();
        try {
            await addMatkul({ ...formData, prodi: 1 });
            Swal.fire("Berhasil", "Mata kuliah berhasil ditambahkan", "success");
            setFormData({ id: "", nama_matkul: "", semester: "" });
            setShowAddModal(false);
            getMatkul();
        } catch (error) {
            Swal.fire("Gagal", "Gagal menambahkan mata kuliah", "error");
        }
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        try {
            await editMatkul(formData.id, {
                id: formData.id,
                nama_matkul: formData.nama_matkul,
                semester: formData.semester,
            });
            Swal.fire("Berhasil", "Mata kuliah berhasil diupdate", "success");
            setFormData({ id: "", nama_matkul: "", semester: "" });
            setShowEditModal(false);
            getMatkul();
        } catch (error) {
            Swal.fire("Gagal", "Gagal mengupdate mata kuliah", "error");
        }
    };

    return {
        matkulList,
        loading,
        searchTerm,
        setSearchTerm,
        showAddModal,
        setShowAddModal,
        showEditModal,
        setShowEditModal,
        formData,
        setFormData,
        handleInputChange,
        handleSubmitAdd,
        handleSubmitEdit,
        openEditModal,
    };
};
