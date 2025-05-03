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
import Course from "./pages/prodi/course/course.jsx";
import AdminHome from './pages/admin/home.jsx'
import SchedulePage from "./pages/prodi/schedule/schedulePage.jsx";
import PeriodPage from "./pages/prodi/periodPage.jsx";

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
    },
    {
        path : 'prodi/course',
        element : <Course/>
    },
    {
        path : 'prodi/schedule',
        element : <SchedulePage/>
    },
    {
        path : 'prodi/period',
        element : <PeriodPage/>
    },
    // ============================== Admin ==============================
    {
        path : 'admin/home',
        element :<AdminHome/>
    }
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