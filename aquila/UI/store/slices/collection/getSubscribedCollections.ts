import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { AppState } from "../..";
import api from "../../../utils/api";
import { Collection } from "../types/Collection";


interface GetSubscribedCollectionsState {
    status: 'idle' | 'pending' | 'succeeded' | 'failed';
    collecitons: null | Collection[];
    errorMessage: null | string;
}

export const getSubscribedCollections = createAsyncThunk<Collection[]>('/subscription/collections', async () => {
    try{
        const resp = await api.get<Collection[]>('/subscription/collections');
        return resp.data;
    }catch(e) {
        let message = "Something went wrong";
        if(e instanceof AxiosError) {
            message = e.response?.data.message || message;
        }
        throw new Error(message);
    }
})

const initialState: GetSubscribedCollectionsState = {
    status: 'idle',
    collecitons: null,
    errorMessage: null
}

const getSubscribedCollectionsSlice = createSlice({
    name: 'getLoggedInCustCollections',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getSubscribedCollections.pending, (state) => {
            state.status = 'pending';
            state.collecitons = null;
            state.errorMessage = null;
        });

        builder.addCase(getSubscribedCollections.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.collecitons = action.payload;
            state.errorMessage = null;
        });

        builder.addCase(getSubscribedCollections.rejected, (state, action) => {
            state.status = 'failed';
            state.errorMessage = action.error.message || "Something went wrong";
            state.collecitons = null;
        });
    }
})


export const selectGetSubscribedCollections = (state: AppState) => state.getSubscribedCollections;

export default getSubscribedCollectionsSlice.reducer;