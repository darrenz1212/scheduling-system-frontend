import { useEffect, useState } from "react";
import {
    AddMatkul,
    fetchDosenList,
    fetchMatkulByPeriod,
} from "../../../api/course/matkulAktif.js";
import { fetchAllMatkul } from "../../../api/course/allCourseService.js";
import { useDispatch } from "react-redux";
import { setDosenList, clearDosenList } from "../../../redux/dosenSlice";
import { fetchAllPeriode } from "../../../api/periodeService.js";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export const useAddPeriodWizard = () => {
    const [allCourses, setAllCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [selectedCourseIds, setSelectedCourseIds] = useState([]);
    const [step, setStep] = useState(1);
    const [wizardData, setWizardData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [periodeList, setPeriodeList] = useState([]);
    const [selectedPeriodeId, setSelectedPeriodeId] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            setLoadingCourses(true);
            try {
                const data = await fetchAllMatkul();
                setAllCourses(data.result || []);
            } catch (err) {
                console.log("Error fetching all courses:", err);
            } finally {
                setLoadingCourses(false);
            }
        };
        fetchCourses();
    }, []);

    useEffect(() => {
        const fetchPeriodeList = async () => {
            try {
                const response = await fetchAllPeriode();
                const list = Array.isArray(response) ? response : response.result || [];
                setPeriodeList(list);
                const aktif = list.find((p) => p.active);
                if (aktif) setSelectedPeriodeId(aktif.id);
            } catch (err) {
                console.error("Gagal fetch periode:", err);
                setPeriodeList([]);
            }
        };
        if (step === 2) fetchPeriodeList();
    }, [step]);

    useEffect(() => {
        const fetchAndStoreDosen = async () => {
            try {
                const response = await fetchDosenList();
                dispatch(setDosenList(response));
            } catch (error) {
                console.log("Gagal ambil dosen:", error);
            }
        };

        if (step === 2) {
            fetchAndStoreDosen();
        } else {
            dispatch(clearDosenList());
        }
    }, [step, dispatch]);

    const getUsedKelasForMatkul = async (matkulId, periodeId) => {
        try {
            const all = await fetchMatkulByPeriod(periodeId);
            return all
                .filter((m) => m.id_matkul === matkulId)
                .map((m) => m.kelas?.trim().toUpperCase())
                .filter(Boolean);
        } catch (err) {
            console.error("Gagal cek kelas existing:", err);
            return [];
        }
    };

    const getAvailableKelasAbjad = (used) => {
        const abjad = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        return abjad.filter((a) => !used.includes(a));
    };

    const toggleCourseSelection = (courseId) => {
        setSelectedCourseIds((prev) =>
            prev.includes(courseId)
                ? prev.filter((id) => id !== courseId)
                : [...prev, courseId]
        );
    };

    const proceedToWizard = async () => {
        const initialData = [];

        for (const courseId of selectedCourseIds) {
            const course = allCourses.find((c) => c.id === courseId);
            const existingKelas = await getUsedKelasForMatkul(courseId, selectedPeriodeId);

            initialData.push({
                id: courseId,
                sks: course?.sks || "",
                enablePraktikum: false,
                sks_praktikum: "",
                dosen: "",
                kelas: "",
                kelasTerpakai: existingKelas, // ini akan digunakan untuk menentukan abjad
            });
        }

        setWizardData(initialData);
        setStep(2);
        setCurrentPage(0);
    };

    const updateWizardData = (index, field, value) => {
        setWizardData((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const nextPage = () => {
        if (currentPage < wizardData.length - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const submitWizard = async () => {
        setSubmitting(true);
        setError(null);
        try {
            const activePeriode = periodeList.find(p => p.active);

            if (!activePeriode) {
                Swal.fire("Gagal", "Tidak ditemukan periode yang aktif.", "error");
                setSubmitting(false);
                return;
            }

            const result = await Swal.fire({
                title: "Konfirmasi",
                html: `Mata kuliah akan ditambahkan ke periode: <strong>${activePeriode.nama}</strong>`,
                icon: "info",
                showCancelButton: true,
                confirmButtonText: "Tambahkan",
                cancelButtonText: "Batal",
                confirmButtonColor: "#3085d6",
            });

            if (!result.isConfirmed) {
                setSubmitting(false);
                return;
            }

            const selectedId = activePeriode.id;

            for (const payload of wizardData) {
                if (!Array.isArray(payload.kelasList)) continue;

                for (const kelasObj of payload.kelasList) {
                    const mainPayload = {
                        id_matkul: payload.id,
                        sks: payload.sks,
                        praktikum: false,
                        dosen: kelasObj.dosen,
                        kelas: kelasObj.kelas,
                        periode: selectedId,
                    };

                    await AddMatkul(mainPayload);

                    // handle praktikum
                    if (payload.enablePraktikum && payload.sks_praktikum) {
                        const sksValue = parseInt(payload.sks_praktikum);
                        if (payload.pisahPraktikum && sksValue === 2) {
                            for (let i = 0; i < 2; i++) {
                                await AddMatkul({
                                    id_matkul: payload.id,
                                    sks: 1,
                                    praktikum: true,
                                    dosen: kelasObj.dosen,
                                    kelas: kelasObj.kelas,
                                    periode: selectedId,
                                });
                            }
                        } else {
                            await AddMatkul({
                                id_matkul: payload.id,
                                sks: sksValue,
                                praktikum: true,
                                dosen: kelasObj.dosen,
                                kelas: kelasObj.kelas,
                                periode: selectedId,
                            });
                        }
                    }
                }
            }

            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Mata kuliah berhasil ditambahkan ke periode.",
                confirmButtonColor: "#3085d6",
            });

            navigate("/prodi/course");
            setStep(1);
            setSelectedCourseIds([]);
            setWizardData([]);
            setCurrentPage(0);
        } catch (err) {
            console.error("Error submitting wizard:", err);
            setError(err);
        } finally {
            setSubmitting(false);
        }
    };


    return {
        step,
        allCourses,
        loadingCourses,
        selectedCourseIds,
        toggleCourseSelection,
        proceedToWizard,
        wizardData,
        currentPage,
        updateWizardData,
        nextPage,
        prevPage,
        submitWizard,
        submitting,
        error,
        setStep,
        periodeList,
        selectedPeriodeId,
        setSelectedPeriodeId,
        getAvailableKelasAbjad,
        getUsedKelasForMatkul,
    };
};
