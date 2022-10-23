import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { AppState } from "..";
import api from "../../utils/api";
import { AsyncThunkSubmissionError } from "./errors/AsyncThunkSubmissionError";
import { ValidationErrors } from "./types/validationErrors";
import { createSubmissionErrorFromErrObj } from "./utils/createError";

interface Customer {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
    secretKey: string;
    desc: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface Collection {
    id: string;
    name: string;
    desc: string;
    customerId: string;
    aquilaDbName: string;
    isSharable: true;
    indexedDocsCount: number;
    createdAt: string;
    updatedat: string;
}

interface SignUpData {
    firstName: string;
    lastName: string;
}

type SignUpRequestPayload = SignUpData;

interface SignUpResponsePayload {
    customer: Customer;
    collection: Collection ;
}

type SignUpValidationErrors = ValidationErrors<SignUpRequestPayload>

interface SignUpState {
    status: 'idle' | 'pending' | 'succeeded' | 'failed';
    customer: Customer | null
    errors: SignUpValidationErrors | null;
    errorMessage: string | null;
}

const initialState: SignUpState = {
    status: 'idle',
    customer: null,
    errors: null,
    errorMessage: null
}

export const signUp = createAsyncThunk<Customer, SignUpData, { rejectValue: AsyncThunkSubmissionError<SignUpValidationErrors | null>}>("/customer/sign-up", async (data, thunkApi) => {
    try {
        const res = await api.post<SignUpResponsePayload>('/customer', data);
        return res.data.customer;
    }catch(e) {
        let err: AsyncThunkSubmissionError<SignUpValidationErrors | null>= new AsyncThunkSubmissionError("Something went wrong", null);
        if(e instanceof Error) {
            err = createSubmissionErrorFromErrObj<SignUpValidationErrors>(e); 
        }
        return thunkApi.rejectWithValue(err);
    }
})

export const signUpSlice = createSlice({
    name: 'signUp',
    initialState,
    reducers: {
        removeSignUpData: (state) => {
            state.status = 'idle';
            state.customer = null;
            state.errors = null;
            state.errorMessage = null;
        }
    },
    extraReducers: async (builder) => {
        builder.addCase(signUp.fulfilled, (state, action) => {
            if(action.payload) {
                state.customer = action.payload;
                state.errors = null;
                state.status = 'succeeded';
            }
        });

        builder.addCase(signUp.pending, (state) => {
            state.customer = null;
            state.errorMessage = null;
            state.status = "pending";
            state.errors = null;
        })

        builder.addCase(signUp.rejected, (state, action) => {
            state.status = 'failed';
            state.customer = null;
            state.errorMessage = action.error.message || null;
            if(action.payload) {
                state.errorMessage = action.payload.message;
                state.errors = action.payload.validationErrors;
            }
        });
    }
});


export const selectSignUp = (state: AppState) => state.signUp;

export const { removeSignUpData } = signUpSlice.actions;

export default signUpSlice.reducer;