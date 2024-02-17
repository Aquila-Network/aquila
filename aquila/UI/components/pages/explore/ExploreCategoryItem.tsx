import { FC } from "react";
import { Collection } from "../../../store/slices/types/Collection";
import Explore from "./Explore";

import classes from './ExploreCategoryItem.module.scss';

interface ExploreItemProps {
	collections: Collection[];
	title: string;
}

const ExploreItem: FC<ExploreItemProps> = (props) => {
	return (
		<div className={classes["explore-category-item"]}>
			<h2 className={classes["explore-category-item__title"]}>{props.title}</h2>
			<div className={classes["explore-category-item__explore-list"]}>
				{props.collections.map((item, index) => {
					return (
						<div key={index} className={classes["explore-category-item__explore-list-item"]}>
							<Explore collection={item} />
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default ExploreItem;