import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { AppState } from "../..";
import api from "../../../utils/api";
import { Customer } from "../types/Customer";

interface GetCustomerByIdState {
    status: 'idle' | 'pending' | 'succeeded' | 'failed';
    customer: null | Customer;
    errorMessage: null |string;
}

const initialState: GetCustomerByIdState = {
    status: 'idle',
    customer: null,
    errorMessage: null
}

export const getCustomerById = createAsyncThunk<Customer, string>('/customer/public/customerId', async (customerId: string) => {
    try{
    const resp = await api.get<Customer>(`/customer/public/${customerId}`);
    return resp.data;
    }catch(e) {
        let message = "Something went wrong";
        if(e instanceof AxiosError) {
            message = e.response?.data.message || message;
        }
        throw new Error(message);
    }
})

export const getCustomerByIdSlice = createSlice({
    name: 'getCustomerById',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getCustomerById.pending, (state) => {
            state.status = 'pending';
            state.customer = null;
            state.errorMessage = null;
        });

        builder.addCase(getCustomerById.fulfilled, (state, action) => {
            state.customer = action.payload;
            state.status = "succeeded";
            state.errorMessage = null;
        });
        
        builder.addCase(getCustomerById.rejected, (state, action) => {
            state.status = "failed",
            state.errorMessage = action.error.message || "Something went wrong",
            state.customer = null;
        })
    }
});


export const selectGetCustomerById = (state: AppState) => state.getCustomerById;

export default getCustomerByIdSlice.reducer;