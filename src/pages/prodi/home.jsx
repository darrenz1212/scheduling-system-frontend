// src/pages/Home.jsx
import ProdiNav from "./prodiNav.jsx"




export default function ProdiHome() {

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <ProdiNav/>

            {/* Main Content */}
            <div className="flex flex-col w-full">
                <div className="flex items-center justify-center min-h-screen">
                    <h2 className="text-4xl font-bold text-gray-800">Welcome to the prodi Dashboard</h2>
                </div>
            </div>
        </div>
    );
}