import { useEffect, useState } from "react";
import { fetchAllMatkul } from "../../../api/course/allCourseService.js";

export const useAllCourse = () => {
    const [matkulList, setMatkulList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

        getMatkul();
    }, []);

    return{
        matkulList,
        loading
    }
}

