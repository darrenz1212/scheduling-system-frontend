import Sidenav from "../../widgets/layout/sidenav.jsx"; 

const routes = [
    {
        title: "Main Menu",
        pages: [
            { name: "My Schedule", path: "/dosen/schedule" },
            { name: "Pick Schedule", path: "/dosen/pickschedule" },
            { name: "Schedule History", path: "/tables" },
        ],
    },
    {
        title: "Auth Pages",
        pages: [
            { name: "Log Out", path: "/login" },
        ],
    },
];

export default function DosenNav() {
    return <Sidenav brandName="Material Tailwind React" routes={routes} />;
}
