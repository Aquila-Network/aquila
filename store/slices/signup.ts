import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import api from "../../utils/api";
import collectValidationErrors from "../../utils/formValidation";

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

interface SignUpResponsePayload {
    customer: Customer;
    collection: Collection ;
}

type ValidationFields = 'firstName' | 'lastName';

type ValidationErrors = Array<{[Key in ValidationFields]? : string}>

interface SignUpState {
    status: 'idle' | 'pending' | 'succeeded' | 'failed';
    customer: Customer | null
    errors: ValidationErrors | null;
}

const initialState: SignUpState = {
    status: 'idle',
    customer: null,
    errors: null
}

const signUp = createAsyncThunk("/customer/sign-up", async (data: { firstName: string; lastName: string }) => {
    try {
        const res = await api.post<SignUpResponsePayload>('/customer', data);
        return res.data;
    }catch(e) {
        // if(e instanceof AxiosError ) {
        //     if(e.response?.data.message) {
        //         throw new Error(e.response?.data.message);
        //     }
        //     validat
        // }else {
        //     throw new Error("Something went wrong");
        // }
        let errors = {};
        let message = "Something went wrong";
        if(e instanceof AxiosError) {
            if (e.response && e.response.data.errors) {
                errors = collectValidationErrors(e.response.data.errors);
                message = 'Invalid data';
            } else {
                message = 'Somthing went wrong';
            }
            dispatch(addUserErrorAction(errors._error));
            throw new SubmissionError(errors);
        }
    }
})

const signUpSlice = createSlice({
    name: 'signUp',
    initialState,
    extraReducers: async () => {

    }
})