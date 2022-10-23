import Link from 'next/link';
import classes from './Footer.module.scss';
import { FaGithub, FaYoutube, FaMedium } from 'react-icons/fa';

const Footer = () => {
	return (
		<footer className={classes.footer}>
			<p>Copyright © 2022 - All right reserved by Aquila Network</p>
			<ul className={classes["footer__icon-menu"]}>
				<li className={classes["footer__icon-menu-item"]}>
					<a target="__blank" href="https://github.com/Aquila-Network" className={classes["footer__icon-menu-link"]}><FaGithub /></a>
				</li>	
				<li className={classes["footer__icon-menu-item"]}>
					<a target="__blank" href="https://medium.com/aquila-network" className={classes["footer__icon-menu-link"]}><FaMedium /></a>
				</li>
				<li className={classes["footer__icon-menu-item"]}>
					<a target="__blank" href="https://www.youtube.com/channel/UCcghHPcdlh0V5TdQfLHjhOA" className={classes["footer__icon-menu-link"]}><FaYoutube /></a>
				</li>
			</ul>
		</footer>
	);
}

export default Footer;