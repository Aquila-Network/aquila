import { IoSearch } from 'react-icons/io5';
import classes from './SearchBar.module.scss';

const SearchBar = () => {
	return (
		<div className={classes["search-bar"]}>
			<div className={classes["search-bar__container"]}>
				<input className={classes["search-bar__input"]} placeholder='Search Bookmarks...' type="text" />
				<button className={classes["search-bar__btn"]}>
					<IoSearch />
				</button>
			</div>
		</div>
	)
}

export default SearchBar;