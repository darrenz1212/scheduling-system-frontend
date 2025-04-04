import { useEffect, useState } from "react";
import { AddMatkul, fetchDosenList } from "../../../api/course/activeCourseService";
import { fetchAllMatkul } from "../../../api/course/allCourseService.js";
import { useDispatch } from "react-redux";
import { setDosenList, clearDosenList } from "../../../redux/dosenSlice"; // sesuaikan path

export const useAddPeriodWizard = () => {
    const [allCourses, setAllCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [selectedCourseIds, setSelectedCourseIds] = useState([]);
    const [step, setStep] = useState(1);
    const [wizardData, setWizardData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const dispatch = useDispatch();

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

    // Fetch dosen
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
            for (const payload of wizardData) {
                await AddMatkul({
                    id_matkul: payload.id,
                    sks: payload.sks,
                    praktikum: false,
                    dosen: payload.dosen,
                    kelas: payload.kelas,
                    periode: 4,
                });

                if (payload.enablePraktikum && payload.sks_praktikum) {
                    await AddMatkul({
                        id_matkul: payload.id,
                        sks: payload.sks_praktikum,
                        praktikum: true,
                        dosen: payload.dosen,
                        kelas: payload.kelas,
                        periode: 4,
                    });
                }
            }

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
    };
};
