import { useEffect, useState } from "react";
import { AddMatkul, fetchDosenList } from "../../../api/course/activeCourseService";
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

                const aktif = list.find(p => p.active);
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

    const toggleCourseSelection = (courseId) => {
        setSelectedCourseIds((prev) =>
            prev.includes(courseId)
                ? prev.filter((id) => id !== courseId)
                : [...prev, courseId]
        );
    };

    const proceedToWizard = () => {
        const initialData = selectedCourseIds.map((courseId) => {
            const course = allCourses.find((c) => c.id === courseId);
            return {
                id: courseId,
                sks: course?.sks || "",
                enablePraktikum: false,
                sks_praktikum: "",
                dosen: "",
                kelas: "",
            };
        });
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
            // 1. Tampilkan dialog pemilihan periode
            const { value: selectedId } = await Swal.fire({
                title: "Pilih Periode",
                html: `
                <select id="periodeSelect" class="swal2-select" style="width: 100%; padding: 8px; border-radius: 5px;">
                    ${periodeList
                    .map(p => `<option value="${p.id}">${p.nama} ${p.active ? "(Aktif)" : ""}</option>`)
                    .join("")}
                </select>
            `,
                confirmButtonText: "Tambahkan",
                focusConfirm: false,
                preConfirm: () => {
                    const selected = document.getElementById("periodeSelect").value;
                    if (!selected) {
                        Swal.showValidationMessage("Silakan pilih periode.");
                    }
                    return selected;
                },
            });

            if (!selectedId) {
                setSubmitting(false);
                return;
            }

            // 2. Simpan ke database
            console.log("DATA YANG DIKIRIM KE DATABASE:");
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

                    console.log("Matkul Teori:", mainPayload);
                    await AddMatkul(mainPayload);

                    if (payload.enablePraktikum && payload.sks_praktikum) {
                        const praktikumPayload = {
                            id_matkul: payload.id,
                            sks: payload.sks_praktikum,
                            praktikum: true,
                            dosen: kelasObj.dosen,
                            kelas: kelasObj.kelas,
                            periode: selectedId,
                        };

                        console.log("Matkul Praktikum:", praktikumPayload);
                        await AddMatkul(praktikumPayload);
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

            // Reset wizard
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
    };
};
