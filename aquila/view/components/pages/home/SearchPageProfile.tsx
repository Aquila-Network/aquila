import { VscFeedback } from 'react-icons/vsc';
import { toast } from 'react-toastify';
import Avatar from "boring-avatars";

import classes from './SearchPageProfile.module.scss';
import { Customer } from '../../../store/slices/types/Customer';
import { FC, useRef, useState } from 'react';
import { Collection } from '../../../store/slices/types/Collection';

interface SearchPageProfileProps {
	customer: Customer;
	collection: Collection;
	onSubscribe: Function;
	onUnsubscribe: Function;
	isCollectionSubscribed: boolean | null;
}

const SearchPageProfile: FC<SearchPageProfileProps> = ({ customer, collection, onSubscribe, onUnsubscribe, isCollectionSubscribed }) => {

	const bookmarkShareLinkRef = useRef<HTMLInputElement | null>(null);
	const [isSubscribing, setIsSubscribing] = useState(false);
	const [isUnSubscribing, setIsUnSubscribing] = useState(false);

	const OnClickCopyBtnHandler = () => {
		navigator.clipboard.writeText(bookmarkShareLinkRef.current?.value || "");
        toast("Collection link copied", { position: "top-center"});
	}

	const onClickSubscribeHandler = async (e: any) => {
		e.preventDefault()
		setIsSubscribing(true);
		await onSubscribe(collection.id)
		setIsSubscribing(false);
	}

	const onClickUnSubscribeHandler = async (e: any) => {
		e.preventDefault()
		setIsUnSubscribing(true);
		await onUnsubscribe(collection.id)
		setIsUnSubscribing(false);
	}

	return (
		<div className={classes["search-profile"]}>
			<div className={classes["search-profile__header"]}>
				<div className={classes["search-profile__header-left"]}>
					<div className={classes["search-profile__header-avatar"]}>
						<Avatar size="100%" variant="beam" name={`${customer.firstName} ${customer.lastName}`} />
					</div>
					<h3 className={classes["search-profile__header-name"]}>{`${customer.firstName} ${customer.lastName} (Me)`}</h3>
				</div>
				<div className={classes["search-profile__header-right"]}>
					{!isCollectionSubscribed && <button disabled={isSubscribing} onClick={onClickSubscribeHandler} className={classes["search-profile__header-subscribe-btn"]}>Subscribe</button>}
					{isCollectionSubscribed && <button disabled={isUnSubscribing} onClick={onClickUnSubscribeHandler} className={classes["search-profile__header-subscribe-btn"]}>UnSubscribe</button>}
				</div>
			</div>
			<div className={classes["search-profile__body"]}>
				<p className={classes["search-profile__body-desc"]}>{collection.desc}</p>
				<div className={classes["search-profile__body-bookmark"]}>
					<p className={classes["search-profile__body-bookmark-title"]}>Share this bookmark</p>
					<div className={classes["search-profile__body-share-bookmark-box"]}>
						<input ref={bookmarkShareLinkRef} readOnly className={classes["search-profile__body-share-bookmark-link"]} type="text" value={`${process.env.NEXT_PUBLIC_BASE_URL}/collection/bookmark/${collection.id}`} />
						<span onClick={OnClickCopyBtnHandler} className={classes["search-profile__body-share-bookmark-btn"]}>Copy</span>
					</div>
				</div>
				<div className={classes["search-profile__body-feedback-container"]}>
					<a href="https://airtable.com/shr3QnQbBhWmIKv8p" target="__blank" className={classes["search-profile__body-feedback-txt"]} >send us your feedback <VscFeedback /></a>
				</div>
			</div>
		</div>
	)
}

export default SearchPageProfile;