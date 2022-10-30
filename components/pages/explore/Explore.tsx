import Avatar from "boring-avatars";
import { FC } from "react";
import { Collection } from "../../../store/slices/types/Collection";

import classes from "./Explore.module.scss";

interface ExploreProps {
	collection: Collection
}

const Explore: FC<ExploreProps> = (props) => {
	return (
		<div className={classes.explore}>
			<div className={classes.explore__header}>
				<div className={classes["explore__header-avatar"]}>
					<Avatar />
				</div>
				<a href="#" className={classes["explore__header-title"]}>{props.collection.name}</a>
			</div>
			<div className={classes["explore__content"]}>
				<p className={classes["explore__content-desc"]}>{props.collection.desc}</p>
			</div>
		</div>
	)
}

export default Explore;