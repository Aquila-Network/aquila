import { FC } from "react";

import { AppState } from '../../../store/';
import BoxCenterLayout from "../../layout/boxCenter/BoxCenterLayout";
import SignUpForm from "./SignUpForm";

interface SignUpPageWrapperProps {
	onSignUp: Function,
	name: {
		firstName: string | null;
		lastName: string | null;
	},
	signUpState: AppState["signUp"]
}

const SignUpPageWrapper: FC<SignUpPageWrapperProps> = (props) => {
	return (
		<BoxCenterLayout>
			<SignUpForm 
				name={props.name}
				onSignUp={props.onSignUp}
				signUpState={props.signUpState}
			/>
		</BoxCenterLayout>
	)
}

export default SignUpPageWrapper;