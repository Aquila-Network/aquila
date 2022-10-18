import classes from './EDitProfileForm.module.scss';

const EditProfileForm = () => {
    return (
        <form className={classes["edit-profile-form"]}>
            <div className={classes["edit-profile-form__form-group"]}>
                <label className={classes["edit-profile-form__form-label"]}>First Name</label>
                <input className={classes["edit-profile-form__form-control"]} type="text" />
            </div>
            <div className={classes["edit-profile-form__form-group"]}>
                <label className={classes["edit-profile-form__form-label"]}>Last Name</label>
                <input className={classes["edit-profile-form__form-control"]} type="text" />
            </div>
            <div className={classes["edit-profile-form__form-group"]}>
                <label className={classes["edit-profile-form__form-label"]}>Email</label>
                <input className={classes["edit-profile-form__form-control"]} type="email" />
            </div>
            <div className={classes["edit-profile-form__form-group"]}>
                <label className={classes["edit-profile-form__form-label"]}>Description</label>
                <textarea className={classes["edit-profile-form__form-control"]} rows={5} ></textarea>
            </div>
            <div className={classes["edit-profile-form__form-group"]}>
                <input className={classes["edit-profile-form__form-btn"]} type="submit" value="Save" />
            </div>
        </form>
    )
}

export default EditProfileForm;