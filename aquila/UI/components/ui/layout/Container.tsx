import { FC } from "react";

import classes from './Container.module.scss';

interface ContainerProps {
    children: React.ReactNode;
}

const Container: FC<ContainerProps> = (props) => {
    return <div className={classes.container}>{props.children}</div>
}

export default Container;