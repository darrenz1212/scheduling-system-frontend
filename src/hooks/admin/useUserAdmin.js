// src/hooks/useUserAdmin.js
import { useEffect, useState } from "react";
import {
    fetchAllUser,
    createUser,
    updateUser,
    fetchAllProdi
    // deleteUser,
} from "../../api/admin/adminService.js";

export const useUserAdmin = () => {
    const [users, setUsers] = useState([]);
    const [prodiList, setProdiList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const handleUpdateUser = async (userId, updatedData) => {
        await updateUser(userId, updatedData);
        await loadUsers();
    };

    const handleCreateUser = async (newUserData) => {
        await createUser(newUserData);
        await loadUsers();
    };

    return {
        users,
        prodiList,
        loading,
        error,
        handleCreateUser,
        handleUpdateUser,
        reloadUsers: loadUsers,
    };
};
