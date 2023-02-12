import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { AppState } from "../..";
import api from "../../../utils/api";
import { AsyncThunkSubmissionError } from "../errors/AsyncThunkSubmissionError";
import { Customer } from "../types/Customer";
import { ValidationErrors } from "../types/validationErrors";
import { createSubmissionErrorFromErrObj } from "../utils/createError";



export interface ActivateCustomerData {
    firstName: string;
    lastName: string;
    email: string;
    desc: string;
    lightningAddress: string;
}

type ActivateCustomerReqPayload = ActivateCustomerData;

type ActivateCustomerResPayload = Customer;

type ActivateCustomerValidationErrors = ValidationErrors<ActivateCustomerData>;

interface ActivateCustomerState {
    status: 'idle' | 'pending' | 'succeeded' | 'failed';
    customer: null | Customer;
    errorMessage: null |string;
    errors: ActivateCustomerValidationErrors | null;
}

const initialState: ActivateCustomerState = {
    status: 'idle',
    customer: null,
    errorMessage: null,
    errors: null
}

export const activateCustomer = createAsyncThunk<Customer, ActivateCustomerData, { rejectValue: AsyncThunkSubmissionError<ActivateCustomerValidationErrors | null>}>('/customer/activate', async (data, thunkApi) => {
    try {
        const res = await api.post<ActivateCustomerResPayload>('/customer/activate', data);
        return res.data;
    } catch(e) {
        let err: AsyncThunkSubmissionError<ActivateCustomerValidationErrors | null>= new AsyncThunkSubmissionError("Something went wrong", null);
        if(e instanceof Error) {
            err = createSubmissionErrorFromErrObj<ActivateCustomerValidationErrors>(e); 
        }
        return thunkApi.rejectWithValue(err);
    }
});

export const activateCustomerSlice = createSlice({
    name: 'activateCustomer',
    initialState,
    reducers: {},
    extraReducers: async (builder) => {
        builder.addCase(activateCustomer.pending, (state, action) => {
            state.customer = null;
            state.errorMessage = null;
            state.errors = null;
            state.status = "pending";
        })

        builder.addCase(activateCustomer.fulfilled, (state, action) => {
            state.customer = action.payload;
            state.status = "succeeded";
            state.errorMessage = null;
            state.errors = null;
        })

        builder.addCase(activateCustomer.rejected, (state, action) => {
            state.status = 'failed';
            state.errorMessage = action.error.message || null;
            state.customer = null;
            if(action.payload) {
                state.errorMessage = action.payload.message;
                state.errors = action.payload.validationErrors;
            }
        })
    }
})


export const selectActivateCustomer = (state: AppState) => state.activateCustomer;

export default activateCustomerSlice.reducer;