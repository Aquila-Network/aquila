import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { AppState } from '../../../store';

import classes from './SignUpForm.module.scss';

interface SignUpFormProps {
	onSignUp: Function;
	name: {
		firstName: string | null;
		lastName: string | null;
	},
	signUpState: AppState["signUp"]
}

type FormData = {
	firstName: string;
	lastName: string;
}

const SignUpForm: FC<SignUpFormProps> = (props) => {
	const {
		name,
		onSignUp,
		signUpState
	} = props;

	const { register, handleSubmit, setValue, setError, formState: { errors } } = useForm<FormData>();
	const [ isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if(name.firstName && name.lastName) {
			setValue("firstName", name.firstName);
			setValue("lastName", name.lastName);
		}	
	}, [name.firstName, name.lastName, setValue])

	useEffect(() => {
		if(signUpState.errors) {
			signUpState.errors.firstName && setError("firstName", { type: 'custom', message: signUpState.errors.firstName });
			signUpState.errors.lastName && setError("lastName", { type: 'custom', message: signUpState.errors.lastName });
		}
	}, [signUpState])

	const onSubmitHandler = (data: any) => {
		setIsLoading(true);
		onSignUp(data)
			.then(() => {
				setIsLoading(false);
			})
	};

	return (
		<div className={classes["signup-box"]}>
			<form onSubmit={handleSubmit(onSubmitHandler)}>
				<div className={classes["signup-box__header"]}>
					<h3 className={classes["signup-box__title"]}>Generate Account</h3>
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
						{errors.firstName && <p className={classes["signup-box__form-error"]}>{errors.firstName.message}</p>}
					</div>
					<div className={classes["signup-box__form-item"]}>
						<label className={classes["signup-box__form-label"]}>Signup name</label>
						<input 
							{...register("lastName", { required: true})}
							className={classes["signup-box__form-control"]}
							type="text"
							placeholder="Last name"
						/>
						{errors.lastName && <p className={classes["signup-box__form-error"]}>{errors.lastName.message}</p>}
					</div>
					<div className={`${classes["signup-box__form-item"]} ${classes["signup-box__form-item--btn-container"]}`}>
						<button disabled={isLoading} className={classes["signup-box__form-btn"]}>Generate Account</button>
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