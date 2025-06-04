import Sidenav from "../../widgets/layout/sidenav.jsx";

const routes = [
    {
        title: "Main Menu",
        pages: [
            { name: "Time Table", path: "/prodi/schedule" },
            { name: "Jadwal", path: "/prodi/dosen-schedule" },
            { name: "Mata Kuliah", path: "/prodi/course"},
            { name: "Periode", path: "/prodi/period"},
            { name: "Reset Password", path:"/"},
            { name: "Log Out", path: "/"},
        ],
    },

];

export default function ProdiNav() {
    return <Sidenav brandName="Material Tailwind React" routes={routes} />;
}
