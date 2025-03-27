import Sidenav from "../../widgets/layout/sidenav.jsx";

const routes = [
    {
        title: "Main Menu",
        pages: [
            { name: "Schedule", path: "prodi/home" },
            { name: "Generate Schedule", path: "/tables"},
            { name: "Lecture Availability", path: "/prodi/dosen-schedule" },
            { name: "Lecture Subject", path: "/tables"},
            { name: "Learning Period", path: "/tables"},
            { name: "Log Out", path: "/"},
        ],
    },
];

export default function ProdiNav() {
    return <Sidenav brandName="Material Tailwind React" routes={routes} />;
}
