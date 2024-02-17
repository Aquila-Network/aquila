import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { HYDRATE } from "next-redux-wrapper";
import { AppState } from "../..";
import api from "../../../utils/api";
import { Collection } from "../types/Collection";


interface GetFeaturedCollectionsState {
    status: 'idle' | 'pending' | 'succeeded' | 'failed';
    collections: null | Collection[];
    totalPages: number | null;
    totalRecords: number | null;
    currentPage: number | null;
    limit: number | null;
    errorMessage: null | string;
}

interface GetFeaturedCollectionsData {
    collections: Collection[];
    totalPages: number;
    totalRecords: number;
    currentPage: number;
    limit: number
}

type GetFeaturedCollectionsResPayload  = GetFeaturedCollectionsData;

export const getFeaturedCollections = createAsyncThunk<GetFeaturedCollectionsData>('/collection/public/featured', async () => {
    try{
        const resp = await api.get<GetFeaturedCollectionsResPayload>('/collection/my-collections');
        return resp.data;
    }catch(e) {
        let message = "Something went wrong";
        if(e instanceof AxiosError) {
            message = e.response?.data.message || message;
        }
        throw new Error(message);
    }
})

const initialState: GetFeaturedCollectionsState = {
    status: 'idle',
    collections: null,
    totalPages: null,
    totalRecords: null,
    currentPage: null,
    limit: null,
    errorMessage: null
}

const getFeaturedCollectionsSlice = createSlice({
    name: 'getFeaturedCollections',
    initialState,
    reducers: {
        setGetFeaturedCollections: (state, action) => {
            state.status = 'succeeded';
            state.collections = action.payload.collections;
            state.totalPages = action.payload.totalPages;
            state.totalRecords = action.payload.totalRecords;
            state.currentPage = action.payload.currentPage;
            state.limit = action.payload.currentPage;
            state.errorMessage = null;
        }
    },
    extraReducers: {

        [HYDRATE]: (state, action) => {
            if(action.payload.status !== 'idle') {
                state.status = 'succeeded';
                state.collections = action.payload.getFeaturedCollections.collections;
                state.totalPages = action.payload.getFeaturedCollections.totalPages;
                state.totalRecords = action.payload.getFeaturedCollections.totalRecords;
                state.currentPage = action.payload.getFeaturedCollections.currentPage;
                state.limit = action.payload.getFeaturedCollections.limit; 
                return state;
            }
        },

        [getFeaturedCollections.pending as unknown as string]: (state) => {
            state.status = 'pending';
            state.totalPages = null;
            state.totalRecords = null;
            state.currentPage = null;
            state.limit = null;
            state.collections = null;
            state.errorMessage = null;
            return state;
        },

        [getFeaturedCollections.fulfilled as unknown as string]: (state, action) => {
            state.status = 'succeeded';
            state.collections = action.payload.collections;
            state.totalPages = action.payload.totalPages;
            state.totalRecords = action.payload.totalRecords;
            state.currentPage = action.payload.currentPage;
            state.limit = action.payload.limit;
            state.errorMessage = null;
            return state;
        },

        [getFeaturedCollections.rejected as unknown as string]:  (state, action) => {
            state.status = 'failed';
            state.errorMessage = action.error.message || "Something went wrong";
            state.totalPages = null;
            state.totalRecords = null;
            state.currentPage = null;
            state.limit = null;
            state.collections = null;
            return state;
        }
    }
})


export const selectGetFeaturedCollections = (state: AppState) => state.getFeaturedCollections;

export const { setGetFeaturedCollections } = getFeaturedCollectionsSlice.actions;

export default getFeaturedCollectionsSlice.reducer;