import { NextPage } from "next";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast, ToastOptions } from 'react-toastify';

import SignUpPageWrapper from "../components/pages/signUp/SignUpPageWrapper";
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

	const signUpHandler = (data: any) => {
		const toastOptions: ToastOptions = {
			position: "top-center",
			hideProgressBar: true,
		}
		dispatch(signUp(data)).unwrap()
		.then(async (data) => {
			toast("Account Genreated", { ...toastOptions, type: "success"})
			const result = await signIn("credentials", {secretKey: data.secretKey, redirect: false});
			if(result?.ok) {
				setAccountCreated(true);
			}
		})
		.catch((e) => {
			toast(e.message, { ...toastOptions, type: "error"});
		})
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