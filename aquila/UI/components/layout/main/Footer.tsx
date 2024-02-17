import { FC, useState } from 'react';
import Link from 'next/link';
import { FaGithub, FaYoutube, FaMedium } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

import classes from './Footer.module.scss';
import moment from 'moment';

interface FooterProps {
	signedInUser: {
		firstName: string;
		lastName: string;
		createdAt: string;
	} | null;
	accountStatus: string | null;
}

const Footer: FC<FooterProps> = (props) => {
	const [showBanner, setShowBanner] = useState(true);
	const { signedInUser, accountStatus } = props;
	let accountExpiryData;
	if(signedInUser) {
		accountExpiryData = moment(signedInUser.createdAt).add(14, 'days').format('Mo MMMM');
	}

	return (
		<>
			{accountStatus === 'TEMPORARY' && showBanner && <div className={classes["footer-banner"]}>
				<button onClick={() => setShowBanner(false)} className={classes["footer-banner__close-btn"]}><FiX /></button>
				<p className={classes["footer-banner__text"]}>{`Your Account is temporary and will be deleted automatically on ${accountExpiryData}.`}Please <Link href="/account/edit-profile">Activate</Link> you account</p>
			</div>
			}
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
		</>
	);
}

export default Footer;