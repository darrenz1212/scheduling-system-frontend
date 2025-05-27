import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import { clearMatkul } from "../../redux/matkulSlice.jsx"
import { useNavigate } from "react-router-dom";
import Sidenav from "../../widgets/layout/sidenav.jsx";


export default function DosenNav() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        dispatch(clearMatkul());
        navigate("/");
    };

    const routes = [
        {
            title: "Main Menu",
            pages: [
                { name: "My Schedule", path: "/dosen/schedule" },
                { name: "Pick Schedule", path: "/dosen/addschedule" },
            ],
        },
        {
            title: "Auth Pages",
            pages: [
                {
                    name: "Log Out",
                    path: "/",
                    onClick: handleLogout,
                },
            ],
        },
    ];

    return <Sidenav brandName="Material Tailwind React" routes={routes} />;
}
