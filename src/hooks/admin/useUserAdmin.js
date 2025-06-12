import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
    fetchAllUser,
    createUser,
    updateUser,
    fetchAllProdi,
} from "../../api/admin/adminService.js";

export const useUserAdmin = () => {
    const [users, setUsers] = useState([]);
    const [prodiList, setProdiList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [form, setForm] = useState({
        user_id: "",
        username: "",
        password: "",
        status: true,
        prodi: "",
        role: 3,
    });

    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await fetchAllUser();
            const mappedUsers = res.data.result.map((user) => ({
                ...user,
                isInactive: user.status !== "Aktif",
            }));
            setUsers(mappedUsers);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const loadProdi = async () => {
        try {
            const data = await fetchAllProdi();
            setProdiList(data);
        } catch (err) {
            console.error("Error loading prodi:", err);
        }
    };

    useEffect(() => {
        loadUsers();
        loadProdi();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const openAddModal = () => {
        setIsEditMode(false);
        setForm({
            user_id: "",
            username: "",
            password: "",
            status: true,
            prodi: "",
            role: 3,
        });
        setShowModal(true);
    };

    const openEditModal = (user) => {
        setIsEditMode(true);
        setForm({
            user_id: user.user_id,
            username: user.username,
            password: "",
            status: user.status === "Aktif",
            prodi: user.prodi?.id?.toString() || "",
            role: 3,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleSubmit = async () => {
        if (!form.user_id || !form.username || (!isEditMode && !form.password) || !form.prodi) {
            Swal.fire({
                icon: 'warning',
                title: 'Form belum lengkap',
                text: 'Mohon isi semua field yang diperlukan.',
            });
            return;
        }

        try {
            if (isEditMode) {
                await updateUser(form.user_id, {
                    username: form.username,
                    status: Boolean(form.status),
                    prodi: parseInt(form.prodi),
                    role: parseInt(form.role),
                });
            } else {
                await createUser({
                    id: form.user_id,
                    username: form.username,
                    password: form.password,
                    status: Boolean(form.status),
                    prodi: parseInt(form.prodi),
                    role: parseInt(form.role),
                });
            }

            await loadUsers();
            setShowModal(false);

            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'User berhasil disimpan.',
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal menyimpan',
                text: error?.message || 'Terjadi kesalahan saat menyimpan data.',
            });
        }
    };

    return {
        users,
        prodiList,
        loading,
        error,
        form,
        showModal,
        isEditMode,
        handleChange,
        openAddModal,
        openEditModal,
        closeModal,
        handleSubmit,
    };
};