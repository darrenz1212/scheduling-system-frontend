// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = useSelector(state => state.auth.token);
    const user = useSelector(state => state.auth.user);

    if (!token || !user) {
        return <Navigate to="/access-denied" />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/access-denied" />;
    }

    return children;
};

export default ProtectedRoute;
