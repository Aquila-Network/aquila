import { FC } from "react";
import { AppState } from "../../../store";
import ExploreCategoryItem from "./ExploreCategoryItem";

import classes from './ExploreCategoryList.module.scss';

interface ExploreCategoryListProps {
	featuredCollectionsState: AppState["getFeaturedCollections"];
}

const ExploreCategoryList: FC<ExploreCategoryListProps> = (props) => {
	return (
		<div className={classes["explore-category-list"]}>
			{props.featuredCollectionsState.collections &&
			<div className={classes["explore-category-list__item"]}>
				<ExploreCategoryItem title="Featured" collections={props.featuredCollectionsState.collections} />
			</div>
			}
			{/* <div className={classes["explore-category-list__item"]}>
				<ExploreCategoryItem />
			</div> */}
		</div>
	);
}

export default ExploreCategoryList;