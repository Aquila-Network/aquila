import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "..";

interface AuthState {
	isSignedIn: boolean;
	authToken: string | null;
	user: {
		userId: string;
		name: string;
	} | null;
}

interface SignInPayloadAction {
	authToken: string;
	user: {
		userId: string;
		name: string;
	}
}

const initialState: AuthState = {
	isSignedIn: false,
	authToken: null,
	user: null
}

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		signIn: (state, action: PayloadAction<SignInPayloadAction>) => {
			state.isSignedIn = true;
			state.user = action.payload.user;
			state.authToken = action.payload.authToken;
		},
		signOut: (state) => {
			state.isSignedIn = false
			state.authToken = null;
			state.user = null;
		}
	}
});

export const { signIn,  signOut} = authSlice.actions;

export const selectAuth = (state: AppState) => state.auth

export default authSlice.reducer;