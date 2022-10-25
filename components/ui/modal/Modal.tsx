import { FC, useEffect, useState } from "react";
import ReactDOM from 'react-dom';

import classes from './Modal.module.scss';

interface ModelProps {
    children: React.ReactNode;
    onClose: Function
}

const Modal: FC<ModelProps> = (props) => {
    const [mounted, setMounted] = useState(false);

    const onCloseHandler = (e:any) => {
        props.onClose();
    }

    useEffect(() => {
        setMounted(true);
    }, [])
    

    return mounted ? ReactDOM.createPortal(
        <div className={classes.modal} onClick={onCloseHandler}>
            {props.children}
        </div>,
        document.getElementById("modal") as HTMLElement
    ): null;
}

export default Modal;