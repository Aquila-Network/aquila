import { FC } from "react";
import BoxCenterLayout from "../../layout/boxCenter/BoxCenterLayout";
import SignInForm from "./SignInForm";

interface SignInPageWrapperProps {
	onSignIn: Function
}

const SignInPageWrapper: FC<SignInPageWrapperProps> = (props) => {
	return (
		<BoxCenterLayout>
			<SignInForm onSignIn={props.onSignIn} />
		</BoxCenterLayout>
	)
}

export default SignInPageWrapper;
