import Link from "next/link";

import classes from "./Sidebar.module.scss"; 

const Sidebar = () => {
    return (
        <ul className={classes.sidebar}>
            <li className={classes.sidebar__item}>
                <Link href="/account/edit-profile">
                    <a className={classes["sidebar__item-link"]}>Edit Profile</a>
                </Link>
            </li>
            {/* <li className={classes.sidebar__item}>
                <Link href="/">
                    <a className={classes["sidebar__item-link"]}>General</a>
                </Link>
            </li> */}
        </ul>
    )
}

export default Sidebar;