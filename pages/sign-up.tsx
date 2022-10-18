import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

import SignUpPageWrapper from "../components/pages/signUp/SignUpPageWrapper";
import { useAppDispatch, useAppSelector } from "../store";
import { selectAuth } from "../store/slices/auth";
import { fetchNames, removeGeneratedNames, selectGeneratedName } from "../store/slices/generateName";

const SignUpPage: NextPage = () => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const authState = useAppSelector(selectAuth);

	useEffect(() => {
		if(authState.isSignedIn) {
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
		console.log(data);
	} 

	return (
		<SignUpPageWrapper
			onSignUp={signUpHandler}
			name={{firstName: generatedName.firstName, lastName: generatedName.lastName}}
		/>
	);
}

export default SignUpPage;