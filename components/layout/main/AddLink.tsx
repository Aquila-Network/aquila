import { FC } from 'react';
import { IoCloseCircleOutline } from 'react-icons/io5';

import Modal from '../../ui/modal/Modal';
import classes from './AddLink.module.scss';

interface AddLinkProps {
    onClose: Function
}

const AddLink: FC<AddLinkProps> = (props) => {
    return (
        <Modal onClose={props.onClose}>
            <div className={classes["add-link"]} onClick={e => e.stopPropagation()}>
                <span onClick={(e) => props.onClose()} className={classes["add-link__close"]}>
                    <IoCloseCircleOutline />
                </span>
                <div className={classes["add-link__header"]}>
                    <h3 className={classes["add-link__header-title"]}>Add Link</h3>
                </div>
                <form className={classes["add-link__body"]}>
                    <div className={classes["add-link__form-item"]}>
                        <input placeholder='Enter Your Link' className={classes["add-link__form-control"]} type="text" />
                    </div>
                    <div className={classes["add-link__form-item"]}>
                        <button className={classes["add-link__form-btn"]}>Add Link</button>
                    </div>
                </form>
            </div>
        </Modal>
    )
}

export default AddLink;