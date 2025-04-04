import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import authReducer from "./authSlice";
import matkulReducer from "./matkulSlice.jsx"
import dosenReducer from "./dosenSlice.jsx"

const persistConfig = {
    key: "root",
    storage,
};

const rootReducer = combineReducers({
    auth: authReducer,
    matkul : matkulReducer,
    dosen : dosenReducer
});
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
    reducer: persistedReducer,
});
export const persistor = persistStore(store);
export default store;
