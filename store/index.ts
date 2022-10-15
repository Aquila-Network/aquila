import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import authReducer from './slices/auth';

export const createStore = () => {
	return configureStore({
		reducer: {
			auth: authReducer
		}
	});
}

export const store = createStore();

export type AppState =  ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch; 

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>

export const useAppDispatch = () => useDispatch<AppDispatch>()

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
