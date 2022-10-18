import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from "..";
import api from "../../utils/api";

export const fetchNames = createAsyncThunk('customer/generateName', async () => {
    const response = await api.get('/customer/generate-name');
    return response.data;
})

interface GeneratedNameState {
    status: 'idle' | 'pending' | 'succeeded' | 'failed';
    firstName: string | null;
    lastName: string | null;
}

const initialState: GeneratedNameState = {
    status: 'idle',
    firstName: null,
    lastName: null
}

export const generateNameSlice = createSlice({
    name: 'generatedName',
    initialState,
    reducers: {
        removeGeneratedNames: (state) => {
            state.status = 'idle';
            state.firstName = null;
            state.lastName = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchNames.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.firstName = action.payload.firstName;
            state.lastName = action.payload.lastName;
        })
    }
});

export const { removeGeneratedNames } = generateNameSlice.actions;

export const selectGeneratedName = (state: AppState) => state.generatedName;

export default generateNameSlice.reducer;