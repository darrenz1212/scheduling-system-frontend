import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [],
};

const dosenSlice = createSlice({
    name: "dosen",
    initialState,
    reducers: {
        setDosenList: (state, action) => {
            state.data = action.payload;
        },
        clearDosenList: (state) => {
            state.data = [];
        },
    },
});

export const { setDosenList, clearDosenList } = dosenSlice.actions;
export default dosenSlice.reducer;
