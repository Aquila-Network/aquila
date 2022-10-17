import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

import Logo from '../../../public/img/logo.png';
import classes from './Header.module.scss';

interface HeaderProps {
	onSignOut: Function
	isAuth: boolean;
}


const Header: FC<HeaderProps> = (props: HeaderProps) => {
	const signOutHandler = (e: any) => {
		e.preventDefault();
		props.onSignOut();
	}
	return (
		<header className={classes.header}>
			<div className={classes.header__container}>
				<div>
					<Link href="/">
						<a className={classes["header__brand-link"]}>
							<div className={classes["header__brand-img-container"]}>
								<Image src={Logo} alt="Aquila Network Logo" objectFit="contain" />
							</div>
							<h2 className={classes["header__brand-text"]}>AQUILA NETWORK</h2>
						</a>
					</Link>
				</div>
				<nav>
					<ul className={classes["header__nav-list-container"]}>
						<li>
							<Link href="/"><a className={classes["header__nav-list-link"]} >Download</a></Link>
						</li>
						<li>
							<a className={classes["header__nav-list-link"]}  href="https://blog.aquila.network/">Blog</a>
						</li>
						<li>
							<a className={classes["header__nav-list-link"]} href="https://github.com/Aquila-Network">Github</a>
						</li>
						<li>
							<Link href="/explore"><a className={classes["header__nav-list-link"]} >Explore</a></Link>
						</li>
						{!props.isAuth &&
						<li>
							<Link href="/sign-in"><a className={classes["header__nav-list-link"]} >Sign In</a></Link>
						</li>
						}
						{props.isAuth &&
						<li>
							<a href="#" className={classes["header__nav-list-link"]} onClick={signOutHandler} >Sign Out</a>
						</li>
						}
					</ul>
				</nav>
			</div>
		</header>
	)
}

export default Header;