import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { AppState } from "../..";
import api from "../../../utils/api";
import { Collection } from "../types/Collection";

interface GetCollectionByIdState {
    status: 'idle' | 'pending' | 'succeeded' | 'failed';
    collection: null | Collection;
    errorMessage: null |string;
}

const initialState: GetCollectionByIdState = {
    status: 'idle',
    collection: null,
    errorMessage: null
}

export const getCollectionById = createAsyncThunk<Collection, string>('/collection/public/collectionId', async (collectionId: string) => {
    try{
    const resp = await api.get<Collection>(`/collection/public/${collectionId}`);
    return resp.data;
    }catch(e) {
        let message = "Something went wrong";
        if(e instanceof AxiosError) {
            message = e.response?.data.message || message;
        }
        throw new Error(message);
    }
})

export const getCollectionByIdSlice = createSlice({
    name: 'getCollectionByid',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getCollectionById.pending, (state) => {
            state.status = 'pending';
            state.collection = null;
            state.errorMessage = null;
        });

        builder.addCase(getCollectionById.fulfilled, (state, action) => {
            state.collection = action.payload;
            state.status = "succeeded";
            state.errorMessage = null;
        });
        
        builder.addCase(getCollectionById.rejected, (state, action) => {
            state.status = "failed",
            state.errorMessage = action.error.message || "Something went wrong",
            state.collection = null;
        })
    }
});


export const selectGetCollectionById = (state: AppState) => state.getCollectionById;

export default getCollectionByIdSlice.reducer;