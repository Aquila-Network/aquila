import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit"
import { createWrapper } from "next-redux-wrapper";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import authReducer from './slices/auth';
import getCurrentLoggedInCustomerReducer from "./slices/customer/getCurrentLoggedInCustomer";
import generatedNameReducer from './slices/generateName';
import signUpReducer from './slices/signup';
import addLinkReducer from './slices/bookmark/addLink';
import getLoggedInCustCollectionsReducer from './slices/collection/getLoggedInCustCollections';
import activateCustomerReducer from './slices/customer/activateCustomer';
import updateCustomerReducer from './slices/customer/updateCustomer';
import getFeaturedCollectionsReducer from "./slices/collection/getFeaturedCollections";
import getLoggedInCustBookmarksReducer from "./slices/bookmark/getLoggedInCustBookmarks";

export const createStore = () => {
	return configureStore({
		reducer: {
			auth: authReducer,
			generatedName: generatedNameReducer,
			signUp: signUpReducer,
			getCurrentLoggedInCustomer: getCurrentLoggedInCustomerReducer,
			addLink: addLinkReducer,
			getLoggedInCustCollections: getLoggedInCustCollectionsReducer,
			activateCustomer: activateCustomerReducer,
			updateCustomer: updateCustomerReducer,
			getFeaturedCollections: getFeaturedCollectionsReducer,
			getLoggedInCustBookmarks: getLoggedInCustBookmarksReducer,
		},
		middleware: (getDefaultMiddleware) => getDefaultMiddleware({
			serializableCheck: false
		})
	});
}

export const store = createStore();

export type AppStore = ReturnType<typeof createStore>;

export type AppState = ReturnType<AppStore['getState']>;

export type AppDispatch = typeof store.dispatch; 

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>

export const useAppDispatch = () => useDispatch<AppDispatch>()

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export const wrapper = createWrapper<AppStore>(createStore);
