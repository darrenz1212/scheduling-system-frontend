import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./redux/store";
import "../public/css/index.css";
import { MaterialTailwindControllerProvider } from "./context";
import LandingPage from "./pages/landingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Home from "./pages/dosen/home.jsx"
import ProdiHome from "./pages/prodi/home.jsx"
import ScheduleDosen from "./pages/dosen/scheduleDosen.jsx";
import AddSchedule from "./pages/dosen/pickAvailableSchedule.jsx";
import LectureAvailabilitySchedule from "./pages/prodi/lectureAvailabilitySchedule.jsx";

const router = createBrowserRouter([
    // ============================== Auth ==============================
    {
        path: "/",
        element: <LoginPage />,
    },
    // ============================== Dosen ==============================
    {
        path: 'dosen/home',
        element: < Home/>
    },
    {
        path : "dosen/schedule",
        element : <ScheduleDosen/>
    },
    {
        path : "dosen/addschedule",
        element : <AddSchedule/>
    },
    // ============================== Prodi ==============================
    {
        path : 'prodi/home',
        element : <ProdiHome/>
    },
    {
        path : 'prodi/dosen-schedule',
        element : <LectureAvailabilitySchedule/>
    }
    // {
    //     path : "lp",
    //     element : <LandingPage/>
    // }
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <MaterialTailwindControllerProvider>
                    <RouterProvider router={router} />
                </MaterialTailwindControllerProvider>
            </PersistGate>
        </Provider>
    </StrictMode>
);