import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { AppState } from "../..";
import api from "../../../utils/api";
import { AsyncThunkSubmissionError } from "../errors/AsyncThunkSubmissionError";
import { CollectionSubscription } from "../types/CollectionSubscription";
import { ValidationErrors } from "../types/validationErrors";
import { createSubmissionErrorFromErrObj } from "../utils/createError";




interface SubscribeCollectionByIdReqPayload {
    collectionId: string;
};

type SubscribeCollectionByIdResPayload = CollectionSubscription;

type SubscribeCollectionByIdValidationErrors = ValidationErrors<SubscribeCollectionByIdReqPayload>;

interface SubscribeCollectionByIdState {
    status: 'idle' | 'pending' | 'succeeded' | 'failed';
    collectionSubscription: null | CollectionSubscription;
    errorMessage: null |string;
    errors: SubscribeCollectionByIdValidationErrors | null;
}

const initialState: SubscribeCollectionByIdState = {
    status: 'idle',
    collectionSubscription: null,
    errorMessage: null,
    errors: null
}

export const subscribeCollectionById = createAsyncThunk<CollectionSubscription, string, { rejectValue: AsyncThunkSubmissionError<SubscribeCollectionByIdValidationErrors | null>}>('/subscribe/collection-id/add', async (collectionId, thunkApi) => {
    try {
        const res = await api.post<SubscribeCollectionByIdResPayload>(`/subscription/${collectionId}/add`);
        return res.data;
    } catch(e) {
        let err: AsyncThunkSubmissionError<SubscribeCollectionByIdValidationErrors | null>= new AsyncThunkSubmissionError("Something went wrong", null);
        if(e instanceof Error) {
            err = createSubmissionErrorFromErrObj<SubscribeCollectionByIdValidationErrors>(e); 
        }
        return thunkApi.rejectWithValue(err);
    }
});

export const subscribeCollectionByIdSlice = createSlice({
    name: 'subscribeCollectionById',
    initialState,
    reducers: {},
    extraReducers: async (builder) => {
        builder.addCase(subscribeCollectionById.pending, (state, action) => {
            state.collectionSubscription = null;
            state.errorMessage = null;
            state.errors = null;
            state.status = "pending";
        })

        builder.addCase(subscribeCollectionById.fulfilled, (state, action) => {
            state.collectionSubscription = action.payload;
            state.status = "succeeded";
            state.errorMessage = null;
            state.errors = null;
        })

        builder.addCase(subscribeCollectionById.rejected, (state, action) => {
            state.status = 'failed';
            state.errorMessage = action.error.message || null;
            state.collectionSubscription = null;
            if(action.payload) {
                state.errorMessage = action.payload.message;
                state.errors = action.payload.validationErrors;
            }
        })
    }
})


export const selectSubscribeCollectionById = (state: AppState) => state.subscribeCollectionById;

export default subscribeCollectionByIdSlice.reducer;