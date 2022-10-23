import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import { useAppSelector } from '../../../store';
import { selectAuth } from '../../../store/slices/auth';
import BaseLayout from '../base/baseLayout';

import Footer from './Footer';
import Header from './Header';
import classes from './MainLayout.module.scss';

interface MainLayoutProps {
	children: React.ReactNode;
}

const MainLayout: FC<MainLayoutProps> = (props) => {
	const router = useRouter();
	const authState = useAppSelector(selectAuth);
	const [signedInUser, setSignedInUser] = useState<{ firstName: string, lastName: string} | null>(null);

	useEffect(() => {
		if(authState.isSignedIn && authState.customer) {
			setSignedInUser({
				firstName: authState.customer.firstName,
				lastName: authState.customer.lastName
			})
		}
	}, [authState])


	const signOutHandler = async () => {
		await signOut();
		router.push("/sign-in");
	}


	return (
		<BaseLayout>
			<div className={classes["main-layout"]}>
				<div className={classes["main-layout__top"]}>
					<section className={classes["main-layout__header"]}>
						<Header signedInUser={signedInUser} isAuth={authState.isSignedIn} onSignOut={signOutHandler} />
					</section>
					<section className={classes["main-layout__body"]}>{props.children}</section>
				</div>
				<div className={classes["main-layout__bottom"]}>
					<section className={classes["main-layout__footer"]}>
						<Footer />
					</section>
				</div>
			</div>
		</BaseLayout>
	)
}

export default MainLayout;