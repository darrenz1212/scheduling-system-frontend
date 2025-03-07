import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./redux/store";
import LoginPage from "./pages/LoginPage.jsx";
import Home from "./pages/dosen/home.jsx"
import "../public/css/index.css";
import { MaterialTailwindControllerProvider } from "./context";

const router = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage />,
    },
    {
        path : 'dosen/home',
        element : < Home/>
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