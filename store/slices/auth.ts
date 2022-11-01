import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { AppState } from "..";

interface AuthState {
	isSignedIn: boolean | null;
	token: string | null;
	accountStatus: string | null;
	customer: {
		customerId: string;
		firstName: string;
		lastName: string;
	} | null;
	status: 'idle' | 'pending' | 'succeeded' | 'failed';
}

interface SignInPayloadAction {
	token: string;
	accountStatus: string;
	customer: {
		customerId: string;
		firstName: string;
		lastName: string;
	}
}

const initialState: AuthState = {
	isSignedIn: null,
	token: null,
	accountStatus: null,
	customer: null,
	status: 'idle'
}

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		signIn: (state, action: PayloadAction<SignInPayloadAction>) => {
			state.isSignedIn = true;
			state.customer = action.payload.customer;
			state.token = action.payload.token;
			state.accountStatus = action.payload.accountStatus;
			state.status = "succeeded";
		},
		signOut: (state) => {
			state.isSignedIn = false
			state.token = null;
			state.customer = null;
			state.accountStatus = null;
			state.status = "succeeded";
		}
	},
	extraReducers: {
		[HYDRATE]: (state, action) => {
			if(action.payload.auth.status !== "idle") {
				return {
					...state,
					...action.payload.auth
				}
			}
		}
	}
});

export const { signIn,  signOut} = authSlice.actions;

export const selectAuth = (state: AppState) => state.auth

export default authSlice.reducer;