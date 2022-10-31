import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { AppState } from "../..";
import api from "../../../utils/api";
import { Bookmark } from "../types/Bookmark";


interface GetLoggedInCustBookmarksState {
    status: 'idle' | 'pending' | 'succeeded' | 'failed';
    bookmarks: null | Bookmark[];
    totalPages: number | null;
    totalRecords: number | null;
    currentPage: number | null;
    limit: number | null;
    query: string | null;
    errorMessage: null | string;
}

interface GetLoggedInCustBookmarksData {
    bookmarks: null | Bookmark[];
    totalPages: number | null;
    totalRecords: number | null;
    currentPage: number | null;
    limit: number | null;
    query: string | null;
}

type GetLoggedInCustBookmarksResPayload = Omit<GetLoggedInCustBookmarksData, "query">;

export interface GetLoggedInCustBookmarksInputOptions {
    collectionId: string;
    limit?: number;
    query?: string;
    page?: number;
}

export const getLoggedInCustBookmarks = createAsyncThunk<GetLoggedInCustBookmarksData, GetLoggedInCustBookmarksInputOptions>('/bookmarks/collection/search', async (options: GetLoggedInCustBookmarksInputOptions) => {
    try{
        const resp = await api.get<GetLoggedInCustBookmarksResPayload>(`/bookmark/${options.collectionId}/search`, {params: options});
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

const initialState: GetLoggedInCustBookmarksState = {
    status: 'idle',
    bookmarks: null,
    totalPages: null,
    totalRecords: null,
    currentPage: null,
    limit: null,
    query: null,
    errorMessage: null
}

const getLoggedInCustBookmarksSlice = createSlice({
    name: 'getLoggedInCustBookmarks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getLoggedInCustBookmarks.pending, (state) => {
            state.status = 'pending';
            state.bookmarks = null;
            state.totalPages = null;
            state.totalRecords = null;
            state.currentPage = null;
            state.limit = null;
            state.query = null;
            state.errorMessage = null;
        });

        builder.addCase(getLoggedInCustBookmarks.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.bookmarks = action.payload.bookmarks;
            state.totalRecords = action.payload.totalRecords;
            state.totalPages = action.payload.totalPages;
            state.limit = action.payload.limit;
            state.query = action.payload.query;
            state.currentPage = action.payload.currentPage;
            state.errorMessage = null;
        });

        builder.addCase(getLoggedInCustBookmarks.rejected, (state, action) => {
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


export const selectGetLoggedInCustBookmarks = (state: AppState) => state.getLoggedInCustBookmarks;

export default getLoggedInCustBookmarksSlice.reducer;