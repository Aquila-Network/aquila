import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { AppState } from "../..";
import api from "../../../utils/api";
import { Bookmark } from "../types/Bookmark";


interface GetLoggedInCustBookmarksByCollectionIdState {
    status: 'idle' | 'pending' | 'succeeded' | 'failed';
    bookmarks: null | Bookmark[];
    totalPages: number | null;
    totalRecords: number | null;
    currentPage: number | null;
    limit: number | null;
    query: string | null;
    errorMessage: null | string;
}

interface GetLoggedInCustBookmarksByCollectionIdData {
    bookmarks: null | Bookmark[];
    totalPages: number | null;
    totalRecords: number | null;
    currentPage: number | null;
    limit: number | null;
    query: string | null;
}

type GetLoggedInCustBookmarksByCollectionIdResPayload = Omit<GetLoggedInCustBookmarksByCollectionIdData, "query">;

export interface GetLoggedInCustBookmarksByCollectionIdInputOptions {
    collectionId: string;
    limit?: number;
    query?: string;
    page?: number;
}

export const getLoggedInCustBookmarksByCollectionId = createAsyncThunk<GetLoggedInCustBookmarksByCollectionIdData, GetLoggedInCustBookmarksByCollectionIdInputOptions>('/bookmarks/collection/search', async (options: GetLoggedInCustBookmarksByCollectionIdInputOptions) => {
    try{
        const resp = await api.get<GetLoggedInCustBookmarksByCollectionIdResPayload>(`/bookmark/${options.collectionId}/search`, {params: options});
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

const initialState: GetLoggedInCustBookmarksByCollectionIdState = {
    status: 'idle',
    bookmarks: null,
    totalPages: null,
    totalRecords: null,
    currentPage: null,
    limit: null,
    query: null,
    errorMessage: null
}

const getLoggedInCustBookmarksByCollectionIdSlice = createSlice({
    name: 'getBookmarksByCollectionId',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getLoggedInCustBookmarksByCollectionId.pending, (state) => {
            state.status = 'pending';
            state.bookmarks = null;
            state.totalPages = null;
            state.totalRecords = null;
            state.currentPage = null;
            state.limit = null;
            state.query = null;
            state.errorMessage = null;
        });

        builder.addCase(getLoggedInCustBookmarksByCollectionId.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.bookmarks = action.payload.bookmarks;
            state.totalRecords = action.payload.totalRecords;
            state.totalPages = action.payload.totalPages;
            state.limit = action.payload.limit;
            state.query = action.payload.query;
            state.currentPage = action.payload.currentPage;
            state.errorMessage = null;
        });

        builder.addCase(getLoggedInCustBookmarksByCollectionId.rejected, (state, action) => {
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


export const selectGetLoggedInCustBookmarksByCollectionId = (state: AppState) => state.getLoggedInCustBookmarksByCollectionId;

export default getLoggedInCustBookmarksByCollectionIdSlice.reducer;