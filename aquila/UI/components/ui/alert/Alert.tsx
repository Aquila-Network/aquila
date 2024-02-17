import { FC } from 'react';
import classes from './Alert.module.scss';

interface AlertProps {
    message: string;
    type: "danger" | "success" | "info";
}

const alertClassMap = {
    danger: classes["alert--danger"],
    success: classes["alert--success"],
    info: classes["alert--info"]
}

const Alert: FC<AlertProps> = ({ message, type}) => {
    return (
        <div className={`${classes.alert} ${alertClassMap[type]}`}>
            <p className={classes.alert__text}>{message}</p>
        </div>
    )
}

export default Alert;