import { FC } from 'react';

import Footer from './Footer';
import Header from './Header';
import classes from './MainLayout.module.scss';

interface MainLayoutProps {
	children: React.ReactNode;
}

const MainLayout: FC<MainLayoutProps> = (props) => {
	return (
		<div className={classes["main-layout"]}>
			<div className={classes["main-layout__top"]}>
				<section className={classes["main-layout__header"]}>
					<Header />
				</section>
				<section className={classes["main-layout__body"]}>{props.children}</section>
			</div>
			<div className={classes["main-layout__bottom"]}>
				<section className={classes["main-layout__footer"]}>
					<Footer />
				</section>
			</div>
		</div>
	)
}

export default MainLayout;