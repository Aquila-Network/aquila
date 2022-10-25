import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { AppState } from "../..";
import api from "../../../utils/api";
import { Customer } from "../types/Customer";

interface GetCurrentLoggedInCustomerState {
    status: 'idle' | 'pending' | 'succeeded' | 'failed';
    customer: null | Customer;
    errorMessage: null |string;
}

const initialState: GetCurrentLoggedInCustomerState = {
    status: 'idle',
    customer: null,
    errorMessage: null
}

export const getCurrentLoggedInCustomer = createAsyncThunk<Customer>('/customer/getCurrentLoggedInCustomer', async () => {
    try{
    const resp = await api.get<Customer>('/customer/me');
    return resp.data;
    }catch(e) {
        let message = "Something went wrong";
        if(e instanceof AxiosError) {
            message = e.response?.data.message || message;
        }
        throw new Error(message);
    }
})

export const getCurrentLoggedInCustomerSlice = createSlice({
    name: 'getCurrentLoggedInCustomer',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getCurrentLoggedInCustomer.pending, (state) => {
            state.status = 'pending';
            state.customer = null;
            state.errorMessage = null;
        });

        builder.addCase(getCurrentLoggedInCustomer.fulfilled, (state, action) => {
            state.customer = action.payload;
            state.status = "succeeded";
            state.errorMessage = null;
        });
        
        builder.addCase(getCurrentLoggedInCustomer.rejected, (state, action) => {
            state.status = "failed",
            state.errorMessage = action.error.message || "Something went wrong",
            state.customer = null;
        })
    }
});


export const selectGetCurrentLoggedInCustomer = (state: AppState) => state.getCurrentLoggedInCustomer;

export default getCurrentLoggedInCustomerSlice.reducer;