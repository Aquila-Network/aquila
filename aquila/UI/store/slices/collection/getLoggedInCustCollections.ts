import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { AppState } from "../..";
import api from "../../../utils/api";
import { Collection } from "../types/Collection";


interface GetLoggedInCustCollectionsState {
    status: 'idle' | 'pending' | 'succeeded' | 'failed';
    collecitons: null | Collection[];
    errorMessage: null | string;
}

export const getLoggedInCustCollections = createAsyncThunk<Collection[]>('/collection/me', async () => {
    try{
        const resp = await api.get<Collection[]>('/collection/my-collections');
        return resp.data;
    }catch(e) {
        let message = "Something went wrong";
        if(e instanceof AxiosError) {
            message = e.response?.data.message || message;
        }
        throw new Error(message);
    }
})

const initialState: GetLoggedInCustCollectionsState = {
    status: 'idle',
    collecitons: null,
    errorMessage: null
}

const getLoggedInCustCollectionsSlice = createSlice({
    name: 'getLoggedInCustCollections',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getLoggedInCustCollections.pending, (state) => {
            state.status = 'pending';
            state.collecitons = null;
            state.errorMessage = null;
        });

        builder.addCase(getLoggedInCustCollections.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.collecitons = action.payload;
            state.errorMessage = null;
        });

        builder.addCase(getLoggedInCustCollections.rejected, (state, action) => {
            state.status = 'failed';
            state.errorMessage = action.error.message || "Something went wrong";
            state.collecitons = null;
        });
    }
})


export const selectGetLoggedInCustCollections = (state: AppState) => state.getLoggedInCustCollections;

export default getLoggedInCustCollectionsSlice.reducer;