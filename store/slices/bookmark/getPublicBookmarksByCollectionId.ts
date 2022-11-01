import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { AppState } from "../..";
import api from "../../../utils/api";
import { Bookmark } from "../types/Bookmark";


interface GetPublicBookmarksByCollectionIdState {
    status: 'idle' | 'pending' | 'succeeded' | 'failed';
    bookmarks: null | Bookmark[];
    totalPages: number | null;
    totalRecords: number | null;
    currentPage: number | null;
    limit: number | null;
    query: string | null;
    errorMessage: null | string;
}

interface GetPublicBookmarksByCollectionIdData {
    bookmarks: null | Bookmark[];
    totalPages: number | null;
    totalRecords: number | null;
    currentPage: number | null;
    limit: number | null;
    query: string | null;
}

type GetPublicBookmarksByCollectionIdResPayload = Omit<GetPublicBookmarksByCollectionIdData, "query">;

export interface GetPublicBookmarksByCollectionIdInputOptions {
    collectionId: string;
    limit?: number;
    query?: string;
    page?: number;
}

export const getPublicBookmarksByCollectionId = createAsyncThunk<GetPublicBookmarksByCollectionIdData, GetPublicBookmarksByCollectionIdInputOptions>('/bookmarks/public/collection/search', async (options: GetPublicBookmarksByCollectionIdInputOptions) => {
    try{
        const resp = await api.get<GetPublicBookmarksByCollectionIdResPayload>(`/bookmark/public/${options.collectionId}/search`, {params: options});
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

const initialState: GetPublicBookmarksByCollectionIdState = {
    status: 'idle',
    bookmarks: null,
    totalPages: null,
    totalRecords: null,
    currentPage: null,
    limit: null,
    query: null,
    errorMessage: null
}

const getPublicBookmarksByCollectionIdSlice = createSlice({
    name: 'getBookmarksByCollectionId',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getPublicBookmarksByCollectionId.pending, (state) => {
            state.status = 'pending';
            state.bookmarks = null;
            state.totalPages = null;
            state.totalRecords = null;
            state.currentPage = null;
            state.limit = null;
            state.query = null;
            state.errorMessage = null;
        });

        builder.addCase(getPublicBookmarksByCollectionId.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.bookmarks = action.payload.bookmarks;
            state.totalRecords = action.payload.totalRecords;
            state.totalPages = action.payload.totalPages;
            state.limit = action.payload.limit;
            state.query = action.payload.query;
            state.currentPage = action.payload.currentPage;
            state.errorMessage = null;
        });

        builder.addCase(getPublicBookmarksByCollectionId.rejected, (state, action) => {
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


export const selectGetPublicBookmarksByCollectionId = (state: AppState) => state.getPublicBookmarksByCollectionId;

export default getPublicBookmarksByCollectionIdSlice.reducer;