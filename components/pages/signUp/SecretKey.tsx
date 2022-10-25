import Link from "next/link";
import { FC } from "react";
import { CgCopy } from 'react-icons/cg';
import { toast } from 'react-toastify';

import { AppState } from "../../../store";

import classes from './SecretKey.module.scss';

interface SecretKeyProps {
    signUpState: AppState["signUp"];
}

const SecretKey: FC<SecretKeyProps> = ({ signUpState }) => {
    const copyToClipboardHandler = () => {
        navigator.clipboard.writeText(signUpState.customer?.secretKey || "");
        toast("Content copied", { position: "top-center"});
    }

    return (
        <div className={classes["secret-key"]}>
            <div className={classes["secret-key__header"]}>
                <h3 className={classes["secret-key__header-title"]}>Your Account has been generated</h3>
            </div>
            <div className={classes["secret-key__body"]}>
                <h2 className={classes["secret-key__body-title"]}>Your Secret key</h2>
                <p className={classes["secret-key__key"]}>
                    <span className={classes["secret-key__key-text"]}>{signUpState.customer?.secretKey}</span>
                    <span title="Copy to clipboard" onClick={copyToClipboardHandler} className={classes["secret-key__copy-key"]}><CgCopy /></span>
                </p>
                <p className={classes["secret-key__info-text"]}>Make sure to copy your secret key. Secret key is required to login next time</p>
            </div>
            <div className={classes["secret-key__footer"]}>
                <Link href="/home">
                    <a className={classes["secret-key__footer-btn"]}>Continue</a>
                </Link>
            </div>
        </div>
    )
}

export default SecretKey;