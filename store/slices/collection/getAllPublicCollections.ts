import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { HYDRATE } from "next-redux-wrapper";
import { AppState } from "../..";
import api from "../../../utils/api";
import { Collection } from "../types/Collection";


interface GetAllPublicCollectionsState {
    status: 'idle' | 'pending' | 'succeeded' | 'failed';
    collections: null | Collection[];
    totalPages: number | null;
    totalRecords: number | null;
    currentPage: number | null;
    limit: number | null;
    errorMessage: null | string;
}

interface GetAllPublicCollectionsData {
    collections: Collection[];
    totalPages: number;
    totalRecords: number;
    currentPage: number;
    limit: number
}

type GetAllPublicCollectionsResPayload  = GetAllPublicCollectionsData;

export const getAllPublicCollections = createAsyncThunk<GetAllPublicCollectionsData>('/collection/public/all', async () => {
    try{
        const resp = await api.get<GetAllPublicCollectionsResPayload>('/collection/');
        return resp.data;
    }catch(e) {
        let message = "Something went wrong";
        if(e instanceof AxiosError) {
            message = e.response?.data.message || message;
        }
        throw new Error(message);
    }
})

const initialState: GetAllPublicCollectionsState = {
    status: 'idle',
    collections: null,
    totalPages: null,
    totalRecords: null,
    currentPage: null,
    limit: null,
    errorMessage: null
}

const getAllPublicCollectionsSlice = createSlice({
    name: 'getAllPublicCollections',
    initialState,
    reducers: {
        setGetAllPublicCollections: (state, action) => {
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
                state.collections = action.payload.getAllPublicCollections.collections;
                state.totalPages = action.payload.getAllPublicCollections.totalPages;
                state.totalRecords = action.payload.getAllPublicCollections.totalRecords;
                state.currentPage = action.payload.getAllPublicCollections.currentPage;
                state.limit = action.payload.getAllPublicCollections.limit; 
                return state;
            }
        },

        [getAllPublicCollections.pending as unknown as string]: (state) => {
            state.status = 'pending';
            state.totalPages = null;
            state.totalRecords = null;
            state.currentPage = null;
            state.limit = null;
            state.collections = null;
            state.errorMessage = null;
            return state;
        },

        [getAllPublicCollections.fulfilled as unknown as string]: (state, action) => {
            state.status = 'succeeded';
            state.collections = action.payload.collections;
            state.totalPages = action.payload.totalPages;
            state.totalRecords = action.payload.totalRecords;
            state.currentPage = action.payload.currentPage;
            state.limit = action.payload.limit;
            state.errorMessage = null;
            return state;
        },

        [getAllPublicCollections.rejected as unknown as string]:  (state, action) => {
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


export const selectGetAllPublicCollections = (state: AppState) => state.getAllPublicCollections;

export const { setGetAllPublicCollections } = getAllPublicCollectionsSlice.actions;

export default getAllPublicCollectionsSlice.reducer;