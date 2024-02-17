import { NextPage } from "next";
import SignInPageWrapper from "../components/pages/signIn/SignInPageWrapper";
import { signIn } from 'next-auth/react';
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";

import { useAppSelector } from "../store";
import { selectAuth } from "../store/slices/auth";
import { useProgressLoader } from "../components/ui/progressLoader/ProgressLoader";

const SignInPage: NextPage = () => {
	const router = useRouter();

	const authState = useAppSelector(selectAuth);
	const { setLoader } = useProgressLoader();

	useEffect(() => {
		if(authState.isSignedIn) {
			router.push('/home');
		}	
	},[router, authState]);

	const signInHandler = async (secretKey: string) => {
		setLoader(true);
		const resp = await signIn('credentials',{ redirect: false, secretKey });
		if(resp?.ok) {
			router.push('/home');
			setLoader(false);
			return;
		}
		toast("Invalid credentials", { type: "error", position: "top-center"});
		setLoader(false);
	}	

	return <SignInPageWrapper onSignIn={signInHandler}  />
}

export default SignInPage;