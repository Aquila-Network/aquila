import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { Oval } from 'react-loader-spinner';
import finalPropsSelectorFactory from 'react-redux/es/connect/selectorFactory';

import { Customer } from '../../../../store/slices/types/Customer';
import classes from './EDitProfileForm.module.scss';

interface EditProfileFormProps {
    customer: Customer;
    accountStatus: string | null;
}

const EditProfileForm: FC<EditProfileFormProps> = ({customer, accountStatus}) => {

    const { register } = useForm({ defaultValues: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        desc: customer.desc
    } });

    return (
        <form className={classes["edit-profile-form"]}>
            <div className={classes["edit-profile-form__form-group"]}>
                <label className={classes["edit-profile-form__form-label"]}>First Name</label>
                <input {...register("firstName")} className={classes["edit-profile-form__form-control"]} type="text" />
            </div>
            <div className={classes["edit-profile-form__form-group"]}>
                <label className={classes["edit-profile-form__form-label"]}>Last Name</label>
                <input {...register("lastName")} className={classes["edit-profile-form__form-control"]} type="text" />
            </div>
            <div className={classes["edit-profile-form__form-group"]}>
                <label className={classes["edit-profile-form__form-label"]}>Email</label>
                <input {...register("email")} className={classes["edit-profile-form__form-control"]} type="email" />
            </div>
            <div className={classes["edit-profile-form__form-group"]}>
                <label className={classes["edit-profile-form__form-label"]}>Description</label>
                <textarea {...register("desc")}className={classes["edit-profile-form__form-control"]} rows={5} ></textarea>
            </div>
            <div className={classes["edit-profile-form__form-group"]}>
                <button disabled className={classes["edit-profile-form__form-btn"]} type="submit" value="Save" >
                    <span>{accountStatus === "TEMPORARY" ? 'Activate Account' : 'Save' }</span>
                </button>
            </div>
        </form>
    )
}

export default EditProfileForm;