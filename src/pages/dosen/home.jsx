// src/pages/Home.jsx
import Sidenav from "../../widgets/layout/sidenav.jsx";


const routes = [
    {
        title: "Main Menu",
        pages: [
            { name: "My Schedule", path: "/home" },
            { name: "Pick Schedule", path: "/profile" },
            { name: "Schedule History", path: "/tables"},
        ],
    },
    {
        title: "Auth Pages",
        pages: [
            { name: "Log Out", path: "/login"},
        ],
    },
];

export default function Home() {

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidenav brandName="Material Tailwind React" routes={routes}  />

            {/* Main Content */}
            <div className="flex flex-col w-full">
                <div className="flex items-center justify-center min-h-screen">
                    <h2 className="text-4xl font-bold text-gray-800">Welcome to the Dashboard</h2>
                </div>
            </div>
        </div>
    );
}