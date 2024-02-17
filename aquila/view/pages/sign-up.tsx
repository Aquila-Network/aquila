import { NextPage } from "next";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast, ToastOptions } from 'react-toastify';

import SignUpPageWrapper from "../components/pages/signUp/SignUpPageWrapper";
import { useProgressLoader } from "../components/ui/progressLoader/ProgressLoader";
import { useAppDispatch, useAppSelector } from "../store";
import { selectAuth } from "../store/slices/auth";
import { fetchNames, removeGeneratedNames, selectGeneratedName } from "../store/slices/generateName";
import { selectSignUp, signUp } from "../store/slices/signup";

const SignUpPage: NextPage = () => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const authState = useAppSelector(selectAuth);
	const signUpState = useAppSelector(selectSignUp);
	const [accountCreated, setAccountCreated] = useState(false);
	const { setLoader } = useProgressLoader();

	useEffect(() => {
		if(authState.isSignedIn && !accountCreated) {
			router.replace('/home');
		}
	}, [router, authState])

	useEffect(() => {
		dispatch(fetchNames());
		return () => {
			dispatch(removeGeneratedNames());
		}
	}, [dispatch])

	

	const generatedName = useAppSelector(selectGeneratedName);

	const signUpHandler = async (data: any) => {
		const toastOptions: ToastOptions = {
			position: "top-center",
			hideProgressBar: true,
		}
		setLoader(true);
		try{
			const signUpResult = await dispatch(signUp(data)).unwrap()
			setLoader(false);
			toast("Account Genreated", { ...toastOptions, type: "success"})
			const result = await signIn("credentials", {secretKey: signUpResult.secretKey, redirect: false});
			debugger;
			if(result?.ok) {
				setAccountCreated(true);
			}
			return true;
		}catch(e: any) {
			debugger;
			setLoader(false);
			toast(e.message, { ...toastOptions, type: "error"});
			return false;
		}
	} 

	return (
		<SignUpPageWrapper
			onSignUp={signUpHandler}
			signUpState={signUpState}
			name={{firstName: generatedName.firstName, lastName: generatedName.lastName}}
			accountCreated={accountCreated}
		/>
	);
}

export default SignUpPage;