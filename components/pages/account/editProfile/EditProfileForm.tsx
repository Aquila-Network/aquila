import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AppState } from '../../../../store';

import { Customer } from '../../../../store/slices/types/Customer';
import classes from './EditProfileForm.module.scss';

interface EditProfileFormProps {
    customer: Customer;
    accountStatus: string | null;
    onSubmit: Function;
    activateCustomerState: AppState["activateCustomer"];
    updateCustomerState: AppState["updateCustomer"];
}

interface EditProfileFormData {
    firstName: string;
    lastName: string;
    email: string;
    desc: string;
    lightningAddress: string;
}

const EditProfileForm: FC<EditProfileFormProps> = ({customer, accountStatus, onSubmit, activateCustomerState, updateCustomerState}) => {
    const { register, getValues, setError, reset, formState: { errors } } = useForm<EditProfileFormData>({ defaultValues: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        lightningAddress: customer.lightningAddress,
        desc: customer.desc
    } });

    useEffect(() => {
        if(updateCustomerState.errors) {
            if(updateCustomerState.errors.firstName) {
                setError("firstName", { type: 'custom', message: updateCustomerState.errors.firstName });
            }
            if(updateCustomerState.errors.lastName) {
                setError("lastName", { type: 'custom', message: updateCustomerState.errors.lastName });
            }
            if(updateCustomerState.errors.email) {
                setError("email", { type: 'custom', message: updateCustomerState.errors.email });
            }
            if(updateCustomerState.errors.desc) {
                setError("desc", { type: 'custom', message: updateCustomerState.errors.desc });
            }
        }
    }, [updateCustomerState.errors, setError])

    useEffect(() => {
        if(activateCustomerState.errors) {
            if(activateCustomerState.errors.firstName) {
                setError("firstName", { type: 'custom', message: activateCustomerState.errors.firstName });
            }
            if(activateCustomerState.errors.lastName) {
                setError("lastName", { type: 'custom', message: activateCustomerState.errors.lastName });
            }
            if(activateCustomerState.errors.email) {
                setError("email", { type: 'custom', message: activateCustomerState.errors.email });
            }
            if(activateCustomerState.errors.desc) {
                setError("desc", { type: 'custom', message: activateCustomerState.errors.desc });
            }
        }
    }, [activateCustomerState.errors, setError])

    

    const submitHandler = async (e: any) => {
        const data = getValues();
        e.preventDefault();
        const status = await onSubmit(data)
        if(status){
            reset(undefined, { keepValues: true});
        }
    }

    return (
        <form className={classes["edit-profile-form"]} onSubmit={submitHandler}>
            <div className={classes["edit-profile-form__form-group"]}>
                <label className={classes["edit-profile-form__form-label"]}>First Name</label>
                <input {...register("firstName")} className={classes["edit-profile-form__form-control"]} type="text" />
                {errors.firstName && <p className={classes["edit-profile-form__form-control-error"]}>{errors.firstName.message}</p>}
            </div>
            <div className={classes["edit-profile-form__form-group"]}>
                <label className={classes["edit-profile-form__form-label"]}>Last Name</label>
                <input {...register("lastName")} className={classes["edit-profile-form__form-control"]} type="text" />
                {errors.lastName && <p className={classes["edit-profile-form__form-control-error"]}>{errors.lastName.message}</p>}
            </div>
            <div className={classes["edit-profile-form__form-group"]}>
                <label className={classes["edit-profile-form__form-label"]}>Email</label>
                <input {...register("email")} className={classes["edit-profile-form__form-control"]} type="email" />
                {errors.email && <p className={classes["edit-profile-form__form-control-error"]}>{errors.email.message}</p>}
            </div>
            <div className={classes["edit-profile-form__form-group"]}>
                <label className={classes["edit-profile-form__form-label"]}>Lightning address</label>
                <input {...register("lightningAddress")} className={classes["edit-profile-form__form-control"]} type="text" />
                <p className={classes["edit-profile-form__form-control-error"]}>
                    <a target="_blank" rel="noreferrer" href="https://lightningaddress.com/">Get a Lightning address ?</a>
                </p>
                {errors.lightningAddress && <p className={classes["edit-profile-form__form-control-error"]}>{errors.lightningAddress.message}</p>}
            </div>
            <div className={classes["edit-profile-form__form-group"]}>
                <label className={classes["edit-profile-form__form-label"]}>Description</label>
                <textarea {...register("desc")}className={classes["edit-profile-form__form-control"]} rows={5} ></textarea>
                {errors.desc && <p className={classes["edit-profile-form__form-control-error"]}>{errors.desc.message}</p>}
            </div>  
            <div className={classes["edit-profile-form__form-group"]}>
                <button
                    disabled={updateCustomerState.status === "pending" || activateCustomerState.status === "pending"}
                    className={classes["edit-profile-form__form-btn"]}
                    type="submit"
                    value="Save"
                >
                    <span>{accountStatus === "TEMPORARY" ? 'Activate Account' : 'Save' }</span>
                </button>
            </div>
            <div style={{marginTop: "50px"}} className={classes["edit-profile-form__form-group"]}>
                <label className={classes["edit-profile-form__form-label"]}>Secret Key</label>
                <input disabled className={classes["edit-profile-form__form-control"]} type="text" value={customer.secretKey} />
            </div>
        </form>
    )
}

export default EditProfileForm;