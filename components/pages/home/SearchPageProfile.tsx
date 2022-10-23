import { VscFeedback } from 'react-icons/vsc';

import Avatar from "boring-avatars";
import classes from './SearchPageProfile.module.scss';

const SearchPageProfile = () => {
	return (
		<div className={classes["search-profile"]}>
			<div className={classes["search-profile__header"]}>
				<div className={classes["search-profile__header-left"]}>
					<div className={classes["search-profile__header-avatar"]}>
						<Avatar size="80" variant="beam" name="Jubin Jose" />
					</div>
					<h3 className={classes["search-profile__header-name"]}>Jubin Jose</h3>
				</div>
				<div className={classes["search-profile__header-right"]}>
					<button className={classes["search-profile__header-subscribe-btn "]}>Subscribe</button>
				</div>
			</div>
			<div className={classes["search-profile__body"]}>
				<p className={classes["search-profile__body-desc"]}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque neque totam sequi, corrupti porro expedita qui beatae, culpa reprehenderit libero voluptatum</p>
				<div className={classes["search-profile__body-bookmark"]}>
					<p className={classes["search-profile__body-bookmark-title"]}>Share this bookmark</p>
					<div className={classes["search-profile__body-share-bookmark-box"]}>
						<input readOnly className={classes["search-profile__body-share-bookmark-link"]} type="text" value="https://x.aquila.network?share=tSMM6bHboS3WnuJ7B8zRSGL6DScnzL28VwntjCK87" />
						<span className={classes["search-profile__body-share-bookmark-btn shadow"]}>Copy</span>
					</div>
				</div>
				<div className={classes["search-profile__body-feedback-container"]}>
					<a href="#" className={classes["search-profile__body-feedback-txt"]} >send us your feedback <VscFeedback /></a>
				</div>
			</div>
		</div>
	)
}

export default SearchPageProfile;