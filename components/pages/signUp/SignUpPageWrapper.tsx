import { FC } from "react";

import { AppState } from '../../../store/';
import BoxCenterLayout from "../../layout/boxCenter/BoxCenterLayout";
import SecretKey from "./SecretKey";
import SignUpForm from "./SignUpForm";

interface SignUpPageWrapperProps {
	onSignUp: Function,
	name: {
		firstName: string | null;
		lastName: string | null;
	},
	signUpState: AppState["signUp"];
	accountCreated: boolean;
}

const SignUpPageWrapper: FC<SignUpPageWrapperProps> = (props) => {
	return (
		<BoxCenterLayout headerBorder={false}>
			{ !props.accountCreated &&
			<SignUpForm 
				name={props.name}
				onSignUp={props.onSignUp}
				signUpState={props.signUpState}
			/>
			}
			{ props.accountCreated && <SecretKey signUpState={props.signUpState} />	}
		</BoxCenterLayout>
	)
}

export default SignUpPageWrapper;