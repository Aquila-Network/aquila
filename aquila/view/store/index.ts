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
import getLoggedInCustBookmarksByCollectionIdReducer from "./slices/bookmark/getLoggedInCustBookmarksByCollectionId";
import getPublicBookmarksByCollectionIdReducer from "./slices/bookmark/getPublicBookmarksByCollectionId";
import getCustomerByIdReducer from './slices/customer/getCustomerById';
import getCollectionByIdReducer from './slices/collection/getCollectionById';
import subscribeCollectionByIdReducer from './slices/collection/subscribeCollectionById';
import isCollectionSubscribedReducer from './slices/collection/isCollectionSubscribed';
import unSubscribbeCollectionByIdReducer from './slices/collection/unSubscribeCollectionById';
import getAllPublicCollectionsReducer from "./slices/collection/getAllPublicCollections";
import getCustomerSubscriptionsReducer from './slices/collection/getCustomerSubscriptions';
import getSubscribedCollectionsReducer from './slices/collection/getSubscribedCollections';

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
			getLoggedInCustBookmarksByCollectionId: getLoggedInCustBookmarksByCollectionIdReducer,
			getPublicBookmarksByCollectionId: getPublicBookmarksByCollectionIdReducer,
			getCustomerById: getCustomerByIdReducer,
			getCollectionById: getCollectionByIdReducer,
			subscribeCollectionById: subscribeCollectionByIdReducer,
			isCollectionSubscribed: isCollectionSubscribedReducer,
			unSubscribeCollectionById: unSubscribbeCollectionByIdReducer,
			getAllPublicCollections: getAllPublicCollectionsReducer,
			getCustomerSubscriptions: getCustomerSubscriptionsReducer,
			getSubscribedCollections: getSubscribedCollectionsReducer,
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
