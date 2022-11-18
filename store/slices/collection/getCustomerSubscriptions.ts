import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { AppState } from "../..";
import api from "../../../utils/api";
import { Bookmark } from "../types/Bookmark";


interface GetCustomerSubscriptionsState {
    status: 'idle' | 'pending' | 'succeeded' | 'failed';
    bookmarks: null | Bookmark[];
    totalPages: number | null;
    totalRecords: number | null;
    currentPage: number | null;
    limit: number | null;
    query: string | null;
    errorMessage: null | string;
}

interface GetCustomerSubscriptionsData {
    bookmarks: null | Bookmark[];
    totalPages: number | null;
    totalRecords: number | null;
    currentPage: number | null;
    limit: number | null;
    query: string | null;
}

type GetCustomerSubscriptionsResPayload = Omit<GetCustomerSubscriptionsData, "query">;

export interface GetCustomerSubscriptionsInputOptions {
    limit?: number;
    query?: string;
    page?: number;
}

export const getCustomerSubscriptions = createAsyncThunk<GetCustomerSubscriptionsData, GetCustomerSubscriptionsInputOptions>('/subscription', async (options: GetCustomerSubscriptionsInputOptions) => {
    try{
        const resp = await api.get<GetCustomerSubscriptionsResPayload>(`/subscription`, {params: options});
        return {
            ...resp.data,
            query: options.query || null
        }
    }catch(e) {
        let message = "Something went wrong";
        if(e instanceof AxiosError) {
            message = e.response?.data.message || message;
        }
        throw new Error(message);
    }
})

const initialState: GetCustomerSubscriptionsState = {
    status: 'idle',
    bookmarks: null,
    totalPages: null,
    totalRecords: null,
    currentPage: null,
    limit: null,
    query: null,
    errorMessage: null
}

const getCustomerSubscriptionsSlice = createSlice({
    name: 'getBookmarksByCollectionId',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getCustomerSubscriptions.pending, (state) => {
            state.status = 'pending';
            state.bookmarks = null;
            state.totalPages = null;
            state.totalRecords = null;
            state.currentPage = null;
            state.limit = null;
            state.query = null;
            state.errorMessage = null;
        });

        builder.addCase(getCustomerSubscriptions.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.bookmarks = action.payload.bookmarks;
            state.totalRecords = action.payload.totalRecords;
            state.totalPages = action.payload.totalPages;
            state.limit = action.payload.limit;
            state.query = action.payload.query;
            state.currentPage = action.payload.currentPage;
            state.errorMessage = null;
        });

        builder.addCase(getCustomerSubscriptions.rejected, (state, action) => {
            state.status = 'failed';
            state.bookmarks = null;
            state.totalPages = null;
            state.totalRecords = null;
            state.currentPage = null;
            state.limit = null;
            state.query = null;
            state.errorMessage = action.error.message || "Something went wrong";
        });
    }
})


export const selectGetCustomerSubscriptions = (state: AppState) => state.getCustomerSubscriptions;

export default getCustomerSubscriptionsSlice.reducer;