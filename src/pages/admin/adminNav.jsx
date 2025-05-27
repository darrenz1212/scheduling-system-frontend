import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import { clearMatkul } from "../../redux/matkulSlice.jsx"
import { useNavigate } from "react-router-dom";
import Sidenav from "../../widgets/layout/sidenav.jsx";

export default function AdminNav() {
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
                { name: "List User", path: "/admin/home" },
            ],
        },
        {
            title: "Auth Pages",
            pages: [
                {
                    name: "Log Out",
                    path: null,
                    onClick: handleLogout,
                },
            ],
        },
    ];

    return <Sidenav brandName="Material Tailwind React" routes={routes} />;
}
