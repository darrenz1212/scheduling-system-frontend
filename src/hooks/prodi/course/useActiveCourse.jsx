import { useEffect, useState } from "react";
import { fetchMatkulByPeriod, AddMatkul } from "../../../api/course/activeCourseService";
import { fetchAllPeriode } from "../../../api/periodeService";

export const useActiveCourse = () => {
    const [periodeList, setPeriodeList] = useState([]);
    const [selectedPeriode, setSelectedPeriode] = useState("");
    const [activeMatkulList, setActiveMatkulList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingAdd, setLoadingAdd] = useState(false);
    const [errorAdd, setErrorAdd] = useState(null);

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
                const data = await fetchMatkulByPeriod(selectedPeriode);
                setActiveMatkulList(data);
            } catch (err) {
                console.error("Gagal fetch matkul aktif per periode", err);
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
            const updated = await fetchMatkulByPeriod(selectedPeriode);
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
    };
};
