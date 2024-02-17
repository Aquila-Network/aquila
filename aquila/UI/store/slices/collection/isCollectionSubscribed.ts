import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import { AppState } from "../..";
import api from "../../../utils/api";
import { AsyncThunkSubmissionError } from "../errors/AsyncThunkSubmissionError";
import { CollectionSubscription } from "../types/CollectionSubscription";
import { ValidationErrors } from "../types/validationErrors";
import { createSubmissionErrorFromErrObj } from "../utils/createError";


interface IsCollectionSubscribedResPayload {
    isSubscribed: false
}


interface IsCollectionSubscribedState {
    status: 'idle' | 'pending' | 'succeeded' | 'failed';
    isSubscribed: null | boolean;
    errorMessage: null |string;
}

const initialState: IsCollectionSubscribedState = {
    status: 'idle',
    isSubscribed: null,
    errorMessage: null,
}

export const isCollectionSubscribed = createAsyncThunk<boolean, string>('/subscribe/collection-id/is-subscribed', async (collectionId) => {
    try {
        const res = await api.post<IsCollectionSubscribedResPayload>(`/subscription/${collectionId}/is-subscribed`);
        return res.data.isSubscribed;
    } catch(e) {
        let message = "Something went wrong";
        if(e instanceof AxiosError) {
            message = e.response?.data.message || message;
        }
        throw new Error(message);
    }
});

export const isCollectionSubscribedSlice = createSlice({
    name: 'subscribeCollectionById',
    initialState,
    reducers: {},
    extraReducers: async (builder) => {
        builder.addCase(isCollectionSubscribed.pending, (state, action) => {
            state.isSubscribed = null;
            state.errorMessage = null;
            state.status = "pending";
        })

        builder.addCase(isCollectionSubscribed.fulfilled, (state, action) => {
            state.isSubscribed = action.payload;
            state.status = "succeeded";
            state.errorMessage = null;
        })

        builder.addCase(isCollectionSubscribed.rejected, (state, action) => {
            state.status = 'failed';
            state.errorMessage = action.error.message || null;
            state.isSubscribed = null;
        })
    }
})


export const selectIsCollectionSubscribed = (state: AppState) => state.isCollectionSubscribed;

export default isCollectionSubscribedSlice.reducer;