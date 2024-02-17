import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import { AppState } from "../..";
import api from "../../../utils/api";
import { CollectionSubscription } from "../types/CollectionSubscription";





type UnSubscribeCollectionByIdResPayload = CollectionSubscription;


interface UnSubscribeCollectionByIdState {
    status: 'idle' | 'pending' | 'succeeded' | 'failed';
    collectionSubscription: null | CollectionSubscription;
    errorMessage: null |string;
}

const initialState: UnSubscribeCollectionByIdState = {
    status: 'idle',
    collectionSubscription: null,
    errorMessage: null,
}

export const unSubscribeCollectionById = createAsyncThunk<CollectionSubscription, string>('/subscribe/collection-id/remove', async (collectionId, thunkApi) => {
    try {
        const res = await api.post<UnSubscribeCollectionByIdResPayload>(`/subscription/${collectionId}/remove`);
        return res.data;
    } catch(e) {
        let message = "Something went wrong";
        if(e instanceof AxiosError) {
            message = e.response?.data.message || message;
        }
        throw new Error(message); 
    }
});

export const unSubscribeCollectionByIdSlice = createSlice({
    name: 'unSubscribeCollectionById',
    initialState,
    reducers: {},
    extraReducers: async (builder) => {
        builder.addCase(unSubscribeCollectionById.pending, (state, action) => {
            state.collectionSubscription = null;
            state.errorMessage = null;
            state.status = "pending";
        })

        builder.addCase(unSubscribeCollectionById.fulfilled, (state, action) => {
            state.collectionSubscription = action.payload;
            state.status = "succeeded";
            state.errorMessage = null;
        })

        builder.addCase(unSubscribeCollectionById.rejected, (state, action) => {
            state.status = 'failed';
            state.errorMessage = action.error.message || null;
            state.collectionSubscription = null;
        })
    }
})


export const selectUnSubscribeCollectionById = (state: AppState) => state.unSubscribeCollectionById;

export default unSubscribeCollectionByIdSlice.reducer;