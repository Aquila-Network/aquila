import Avatar from "boring-avatars";

import classes from "./Explore.module.scss";

const Explore = () => {
	return (
		<div className={classes.explore}>
			<div className={classes.explore__header}>
				<div className={classes["explore__header-avatar"]}>
					<Avatar />
				</div>
				<a href="#" className={classes["explore__header-title"]}>Explore Title</a>
			</div>
			<div className={classes["explore__content"]}>
				<p className={classes["explore__content-desc"]}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione esse saepe perferendis doloribus. A voluptatem velit sit possimus facilis dignissimos id doloribus natus suscipit deleniti perspiciatis, ipsa provident? Reprehenderit, incidunt!</p>
			</div>
		</div>
	)
}

export default Explore;