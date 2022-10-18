import Avatar from 'boring-avatars';

import classes from './Header.module.scss';

const Header = () => {
    return (
        <header className={classes.header}>
            <div className={classes.header__avatar}>
                <Avatar variant='beam' size={45} />
            </div>
            <div className={classes.header__info}>
                <h3 className={classes["header__info-title"]}>Bob Mob</h3>
                <p className={classes["header__info-desc"]}>Your account</p>
            </div>
        </header>
    );
}

export default Header;