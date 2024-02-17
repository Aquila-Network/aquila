import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { AppState } from "../..";
import api from "../../../utils/api";
import { AsyncThunkSubmissionError } from "../errors/AsyncThunkSubmissionError";
import { Customer } from "../types/Customer";
import { ValidationErrors } from "../types/validationErrors";
import { createSubmissionErrorFromErrObj } from "../utils/createError";



export interface UpdateCustomerData {
    firstName: string;
    lastName: string;
    email: string;
    desc: string;
    lightningAddress: string;
}

type UpdateCustomerReqPayload = UpdateCustomerData;

type UpdateCustomerResPayload = Customer;

type UpdateCustomerValidationErrors = ValidationErrors<UpdateCustomerData>;

interface UpdateCustomerState {
    status: 'idle' | 'pending' | 'succeeded' | 'failed';
    customer: null | Customer;
    errorMessage: null |string;
    errors: UpdateCustomerValidationErrors | null;
}

const initialState: UpdateCustomerState = {
    status: 'idle',
    customer: null,
    errorMessage: null,
    errors: null
}

export const updateCustomer = createAsyncThunk<Customer, UpdateCustomerData, { rejectValue: AsyncThunkSubmissionError<UpdateCustomerValidationErrors | null>}>('/customer/activate', async (data, thunkApi) => {
    try {
        const res = await api.patch<UpdateCustomerResPayload>('/customer', data);
        return res.data;
    } catch(e) {
        let err: AsyncThunkSubmissionError<UpdateCustomerValidationErrors | null>= new AsyncThunkSubmissionError("Something went wrong", null);
        if(e instanceof Error) {
            err = createSubmissionErrorFromErrObj<UpdateCustomerValidationErrors>(e); 
        }
        return thunkApi.rejectWithValue(err);
    }
});

export const updateCustomerSlice = createSlice({
    name: 'updateCustomer',
    initialState,
    reducers: {},
    extraReducers: async (builder) => {
        builder.addCase(updateCustomer.pending, (state, action) => {
            state.customer = null;
            state.errorMessage = null;
            state.errors = null;
            state.status = "pending";
        })

        builder.addCase(updateCustomer.fulfilled, (state, action) => {
            state.customer = action.payload;
            state.status = "succeeded";
            state.errorMessage = null;
            state.errors = null;
        })

        builder.addCase(updateCustomer.rejected, (state, action) => {
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


export const selectUpdateCustomer = (state: AppState) => state.updateCustomer;

export default updateCustomerSlice.reducer;