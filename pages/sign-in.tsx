import { NextPage } from "next";
import SignInPageWrapper from "../components/pages/signIn/SignInPageWrapper";
import { signIn } from 'next-auth/react';
import { useRouter } from "next/router";

const SignInPage: NextPage = () => {
	const router = useRouter();

	const signInHandler = async (secretKey: string) => {
		const resp = await signIn('credentials',{ redirect: false, secretKey });
		if(resp?.ok) {
			alert("Success");
			router.push('/home');
			return;
		}
	}

	return (
		<SignInPageWrapper onSignIn={signInHandler}  />
	);
}

export default SignInPage;