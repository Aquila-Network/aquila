import { FC, useEffect } from 'react';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { useForm } from 'react-hook-form';
import { } from 'react'

import Modal from '../../ui/modal/Modal';
import classes from './AddLink.module.scss';
import { AppState } from '../../../store';

interface AddLinkFromData {
    url: string;
}

interface AddLinkProps {
    onClose: Function;
    onSubmitAddLink: Function;
    addLinkState: AppState["addLink"];
}

const AddLink: FC<AddLinkProps> = ({ onClose, onSubmitAddLink, addLinkState}) => {

    const { register, getValues, setError, formState: { errors }, reset} = useForm<AddLinkFromData>();
    useEffect(() => {
        if(addLinkState.errors) {
            if(addLinkState.errors.url) {
                setError("url", { type: 'custom', message: addLinkState.errors.url });
            }
        }
    }, [addLinkState.errors, setError])
    const onSubmitHandler = async (e: any) => {
        e.preventDefault();
        var data = getValues();
        const status = await onSubmitAddLink(data);
        if(status) {
            reset();
            onClose();
        }
    }

    return (
        <Modal onClose={onClose}>
            <div className={classes["add-link"]} onClick={e => e.stopPropagation()}>
                <span onClick={(e) => onClose()} className={classes["add-link__close"]}>
                    <IoCloseCircleOutline />
                </span>
                <div className={classes["add-link__header"]}>
                    <h3 className={classes["add-link__header-title"]}>Add Link</h3>
                </div>
                <form onSubmit={onSubmitHandler} className={classes["add-link__body"]}>
                    <div className={classes["add-link__form-item"]}>
                        <input {...register("url")} placeholder='Enter Your Link' className={classes["add-link__form-control"]} type="text" />
                        {errors.url && <p className={classes["add-link__form-control-error"]}>{errors.url.message}</p>}
                    </div>
                    <div className={classes["add-link__form-item"]}>
                        <button disabled={addLinkState.status === "pending"} type="submit" className={classes["add-link__form-btn"]}>Add Link</button>
                    </div>
                </form>
            </div>
        </Modal>
    )
}

export default AddLink;