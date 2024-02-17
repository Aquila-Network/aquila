import Avatar from 'boring-avatars';
import { FC } from 'react';
import { AppState } from '../../../../store';

import classes from './Header.module.scss';

interface HeaderProps {
    authState: AppState["auth"];
}

const Header: FC<HeaderProps> = (props) => {
    const name = `${props.authState.customer?.firstName} ${props.authState.customer?.lastName}`;
    return (
        <header className={classes.header}>
            <div className={classes.header__avatar}>
                <Avatar variant='beam' size={45} name={name} />
            </div>
            <div className={classes.header__info}>
                <h3 className={classes["header__info-title"]}>{name}</h3>
                <p className={classes["header__info-desc"]}>Your account</p>
            </div>
        </header>
    );
}

export default Header;