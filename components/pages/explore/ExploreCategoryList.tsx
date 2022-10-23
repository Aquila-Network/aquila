import ExploreCategoryItem from "./ExploreCategoryItem";

import classes from './ExploreCategoryList.module.scss';

const ExploreCategoryList = () => {
	return (
		<div className={classes["explore-category-list"]}>
			<div className={classes["explore-category-list__item"]}>
				<ExploreCategoryItem />
			</div>
			<div className={classes["explore-category-list__item"]}>
				<ExploreCategoryItem />
			</div>
		</div>
	);
}

export default ExploreCategoryList;