import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { selectAuth } from '../../../store/slices/auth';
import { addLink, AddLinkData, selectAddLink } from '../../../store/slices/bookmark/addLink';
import { toast, ToastOptions } from 'react-toastify';

import Footer from './Footer';
import Header from './Header';
import classes from './MainLayout.module.scss';
import { getLoggedInCustCollections, selectGetLoggedInCustCollections } from '../../../store/slices/collection/getLoggedInCustCollections';
import { Omit } from '@reduxjs/toolkit/dist/tsHelpers';
import { useProgressLoader } from '../../ui/progressLoader/ProgressLoader';

interface MainLayoutProps {
	children: React.ReactNode;
	headerBorder?: boolean;
}

const MainLayout: FC<MainLayoutProps> = ({ children, headerBorder = true}) => {
	const router = useRouter();
	const authState = useAppSelector(selectAuth);
	const addLinkState = useAppSelector(selectAddLink)
	const currentCustomerCollections = useAppSelector(selectGetLoggedInCustCollections);
	const dispatch = useAppDispatch();
	const [signedInUser, setSignedInUser] = useState<{ firstName: string, lastName: string, createdAt: string} | null>(null);
	const { setLoader } = useProgressLoader();

	useEffect(() => {
		if(authState.isSignedIn && authState.customer) {
			setSignedInUser({
				firstName: authState.customer.firstName,
				lastName: authState.customer.lastName,
				createdAt: authState.customer.createdAt
			})
		}
	}, [authState]);


	useEffect(() => {
		const toastOptions: ToastOptions = {
			position: "top-center",
			hideProgressBar: true,
		}

		if(authState.isSignedIn) {
			dispatch(getLoggedInCustCollections())
				.unwrap()
				.catch((e) => {
					toast(e.message, { ...toastOptions, type: "error"});
				})
		}
	}, [authState, dispatch]);


	const signOutHandler = async () => {
		await signOut();
		router.push("/sign-in");
	}

	const onSubmitAddLinkHandler = async (data: Omit<AddLinkData, "collectionId">) => {
		setLoader(true);
		const toastOptions: ToastOptions = {
			position: "top-center",
			hideProgressBar: true,
		}
		if(currentCustomerCollections.collecitons && currentCustomerCollections.collecitons[0]) {
			const formData = {
				url: data.url,
				collectionId: currentCustomerCollections.collecitons[0].id
			}
			try {
				await dispatch(addLink(formData)).unwrap();
				toast("Link added successfully", { ...toastOptions, type: "success"})
				setLoader(false);
				return true;
			}catch(e) {
				if(e instanceof Error) {
					toast(e.message, { ...toastOptions, type: "error"});
				}
				setLoader(false);
				return false;
			}
		}
	}


	return (
			<div className={classes["main-layout"]}>
				<div className={classes["main-layout__top"]}>
					<section className={headerBorder ? classes["main-layout__header--with-border"] : ''}>
						<Header 
							addLinkState={addLinkState}
							onSubmitAddLink={onSubmitAddLinkHandler}
							signedInUser={signedInUser}
							isAuth={authState.isSignedIn ? true : false}
							onSignOut={signOutHandler}
						/>
					</section>
					<section className={classes["main-layout__body"]}>{children}</section>
				</div>
				<div className={classes["main-layout__bottom"]}>
					<section className={classes["main-layout__footer"]}>
						<Footer signedInUser={signedInUser} accountStatus={authState?.accountStatus || null}  />
					</section>
				</div>
			</div>
	)
}

export default MainLayout;