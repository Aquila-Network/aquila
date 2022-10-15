import Link from 'next/link';
import classes from './SignupForm.module.scss';

const SignUpForm = () => {
	return (
		<div className={classes["signup-box"]}>
				<div className={classes["signup-box__header"]}>
					<h3 className={classes["signup-box__title"]}>Continue as Guest</h3>
				</div>
				<div className={classes["signup-box__form"]}>
					<div className={classes["signup-box__form-item"]}>
						<label className={classes["signup-box__form-label"]}>First name</label>
						<input className={classes["signup-box__form-control"]} type="text" placeholder="First name" />
					</div>
					<div className={classes["signup-box__form-item"]}>
						<label className={classes["signup-box__form-label"]}>Signup name</label>
						<input className={classes["signup-box__form-control"]} type="text" placeholder="Last name" />
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
			</div>
	)
}

export default SignUpForm;