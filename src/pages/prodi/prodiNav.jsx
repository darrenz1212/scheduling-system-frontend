import Sidenav from "../../widgets/layout/sidenav.jsx";

const routes = [
    {
        title: "Main Menu",
        pages: [
            { name: "Jadwal", path: "/prodi/schedule" },
            { name: "Ketersediaan Mengajar", path: "/prodi/dosen-schedule" },
            { name: "Mata Kuliah", path: "/prodi/course"},
            { name: "Periode", path: "/prodi/period"},
            { name: "Log Out", path: "/"},
        ],
    },
];

export default function ProdiNav() {
    return <Sidenav brandName="Material Tailwind React" routes={routes} />;
}
