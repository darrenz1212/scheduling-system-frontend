import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { matkulList } from "../api/AvailableScheduleService.js";

export const fetchMatkulList = createAsyncThunk(
    "matkul/fetchMatkulList",
    async (dosenId) => {
        const response = await matkulList(dosenId);
        return response;
    }
);

const matkulSlice = createSlice({
    name: "matkul",
    initialState: {
        data: [],
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMatkulList.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMatkulList.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(fetchMatkulList.rejected, (state) => {
                state.loading = false;
            });
    },
});

export default matkulSlice.reducer;
