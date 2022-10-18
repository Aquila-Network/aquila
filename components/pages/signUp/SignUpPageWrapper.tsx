import { FC } from "react";

import BoxCenterLayout from "../../layout/boxCenter/BoxCenterLayout";
import SignUpForm from "./SignUpForm";

interface SignUpPageWrapperProps {
	onSignUp: Function,
	name: {
		firstName: string | null;
		lastName: string | null;
	}
}

const SignUpPageWrapper: FC<SignUpPageWrapperProps> = (props) => {
	return (
		<BoxCenterLayout>
			<SignUpForm 
				name={props.name}
				onSignUp={props.onSignUp}
			/>
		</BoxCenterLayout>
	)
}

export default SignUpPageWrapper;