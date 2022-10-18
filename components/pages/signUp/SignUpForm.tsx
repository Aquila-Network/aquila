import Link from 'next/link';
import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import classes from './SignupForm.module.scss';

interface SignUpFormProps {
	onSignUp: Function;
	name: {
		firstName: string | null;
		lastName: string | null;
	}
}

type FormData = {
	firstName: string;
	lastName: string;
}

const SignUpForm: FC<SignUpFormProps> = (props) => {
	const {
		name,
		onSignUp
	} = props;

	const { register, handleSubmit, setValue } = useForm<FormData>();

	useEffect(() => {
		if(name.firstName && name.lastName) {
			setValue("firstName", name.firstName);
			setValue("lastName", name.lastName);
		}	
	}, [name, setValue])

	const onSubmitHandler = (data: any) => {
		onSignUp(data);
	};

	return (
		<div className={classes["signup-box"]}>
			<form onSubmit={handleSubmit(onSubmitHandler)}>
				<div className={classes["signup-box__header"]}>
					<h3 className={classes["signup-box__title"]}>Continue as Guest</h3>
				</div>
				<div className={classes["signup-box__form"]}>
					<div className={classes["signup-box__form-item"]}>
						<label className={classes["signup-box__form-label"]}>First name</label>
						<input
							{...register("firstName", { required: true})}
							className={classes["signup-box__form-control"]}
							type="text"
							placeholder="First name"
						/>
					</div>
					<div className={classes["signup-box__form-item"]}>
						<label className={classes["signup-box__form-label"]}>Signup name</label>
						<input 
							{...register("lastName", { required: true})}
							className={classes["signup-box__form-control"]}
							type="text"
							placeholder="Last name"
						/>
					</div>
					<div className={`${classes["signup-box__form-item"]} ${classes["signup-box__form-item--btn-container"]}`}>
						<button className={classes["signup-box__form-btn"]}>Continue</button>
					</div>
				</div>
				<div className={classes["signup-box__footer"]}>
					<p className={classes["signup-box__footer-text"]}>
						<span>Already have an account?  </span>
						<Link href="/sign-in"><a className={classes["signup-box__footer-link"]}>Login</a></Link>
					</p>
				</div>
			</form>
		</div>
	)
}

export default SignUpForm;