import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { AppState } from "../..";
import api from "../../../utils/api";
import { AsyncThunkSubmissionError } from "../errors/AsyncThunkSubmissionError";
import { Bookmark } from "../types/Bookmark";
import { ValidationErrors } from "../types/validationErrors";
import { createSubmissionErrorFromErrObj } from "../utils/createError";



export interface AddLinkData {
    url: string;
    collectionId: string;
}

type AddLinkReqPayload = AddLinkData;

type AddLinkResPayload = Bookmark;

type AddLinkValidationErrors = ValidationErrors<AddLinkReqPayload>;

interface AddLinkState {
    status: 'idle' | 'pending' | 'succeeded' | 'failed';
    bookmark: null | Bookmark;
    errorMessage: null |string;
    errors: AddLinkValidationErrors | null;
}

const initialState: AddLinkState = {
    status: 'idle',
    bookmark: null,
    errorMessage: null,
    errors: null
}

export const addLink = createAsyncThunk<Bookmark, AddLinkData, { rejectValue: AsyncThunkSubmissionError<AddLinkValidationErrors | null>}>('/bookmark/add-link', async (data, thunkApi) => {
    try {
        const res = await api.post<AddLinkResPayload>('/bookmark', data);
        return res.data;
    } catch(e) {
        let err: AsyncThunkSubmissionError<AddLinkValidationErrors | null>= new AsyncThunkSubmissionError("Something went wrong", null);
        if(e instanceof Error) {
            err = createSubmissionErrorFromErrObj<AddLinkValidationErrors>(e); 
        }
        return thunkApi.rejectWithValue(err);
    }
});

export const addLinkSlice = createSlice({
    name: 'addLink',
    initialState,
    reducers: {},
    extraReducers: async (builder) => {
        builder.addCase(addLink.pending, (state, action) => {
            state.bookmark = null;
            state.errorMessage = null;
            state.errors = null;
            state.status = "pending";
        })

        builder.addCase(addLink.fulfilled, (state, action) => {
            state.bookmark = action.payload;
            state.status = "succeeded";
            state.errorMessage = null;
            state.errors = null;
        })

        builder.addCase(addLink.rejected, (state, action) => {
            state.status = 'failed';
            state.errorMessage = action.error.message || null;
            state.bookmark = null;
            if(action.payload) {
                state.errorMessage = action.payload.message;
                state.errors = action.payload.validationErrors;
            }
        })
    }
})


export const selectAddLink = (state: AppState) => state.addLink;

export default addLinkSlice.reducer;