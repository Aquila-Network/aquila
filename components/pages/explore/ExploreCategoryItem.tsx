import Explore from "./Explore";

import classes from './ExploreCategoryItem.module.scss';

const ExploreItem = () => {
	return (
		<div className={classes["explore-category-item"]}>
			<h2 className={classes["explore-category-item__title"]}>Hand picks</h2>
			<div className={classes["explore-category-item__explore-list"]}>
				<div className={classes["explore-category-item__explore-list-item"]}>
					<Explore />
				</div>
				<div className={classes["explore-category-item__explore-list-item"]}>
					<Explore />
				</div>
				<div className={classes["explore-category-item__explore-list-item"]}>
					<Explore />
				</div>
				<div className={classes["explore-category-item__explore-list-item"]}>
					<Explore />
				</div>
			</div>
		</div>
	)
}

export default ExploreItem;