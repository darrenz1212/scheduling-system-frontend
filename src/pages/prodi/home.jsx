// src/pages/Home.jsx
import Sidenav from "../../widgets/layout/sidenav.jsx";


const routes = [
    {
        title: "Main Menu",
        pages: [
            { name: "Schedule", path: "/home" },
            { name: "Generate ScheduleDosen", path: "/tables"},
            { name: "Lecture Availability", path: "/profile" },
            { name: "Lecture Subject", path: "/tables"},
            { name: "Learning Period", path: "/tables"},
        ],
    },
    {
        title: "Auth Pages",
        pages: [
            { name: "Log Out", path: "/login"},
        ],
    },
];

export default function ProdiHome() {

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidenav brandName="Material Tailwind React" routes={routes}  />

            {/* Main Content */}
            <div className="flex flex-col w-full">
                <div className="flex items-center justify-center min-h-screen">
                    <h2 className="text-4xl font-bold text-gray-800">Welcome to the prodi Dashboard</h2>
                </div>
            </div>
        </div>
    );
}