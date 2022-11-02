import Link from 'next/link';
import { useRef, useState } from 'react';
import classes from './SignInForm.module.scss';

const SignInForm = (props:any) => {
	const secretKeyRef = useRef<HTMLInputElement>(null);
	const [isLoading, setIsLoading] = useState(false);

	const submitHandler = (e: any) => {
		e.preventDefault();
		setIsLoading(true);
		props.onSignIn(secretKeyRef.current?.value)
			.then(() => {
				setIsLoading(false);
			})
	}

	return (
		<div className={classes["login-box"]}>
			<form onSubmit={submitHandler}>
				<div className={classes["login-box__header"]}>
					<h3 className={classes["login-box__title"]}>Login</h3>
				</div>
				<div className={classes["login-box__form"]}>
					<div className={classes["login-box__form-item"]}>
						<label className={classes["login-box__form-label"]}>Secret key</label>
						<input ref={secretKeyRef} className={classes["login-box__form-control"]} type="text" placeholder="Enter Secret key" />
					</div>
					<div className={`${classes["login-box__form-item"]} ${classes["login-box__form-item--btn-container"]}`}>
						<button disabled={isLoading} type="submit" className={classes["login-box__form-btn"]}>Login</button>
					</div>
				</div>
				<div className={classes["login-box__footer"]}>
					<p className={classes["login-box__footer-text"]}>
						<span>Don&apos;t have an account?  </span>
						<Link href="/sign-up"><a className={classes["login-box__footer-link"]}>Generate an account</a></Link>
					</p>
				</div>
			</form>
		</div>
	)
}

export default SignInForm;