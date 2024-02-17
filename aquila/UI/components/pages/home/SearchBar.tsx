import { FC, useRef } from 'react';
import { IoSearch } from 'react-icons/io5';
import classes from './SearchBar.module.scss';

interface SearchBarProps {
	onSearch: Function
}

const SearchBar: FC<SearchBarProps> = (props) => {
	const { onSearch } = props;
	const searchValueRef = useRef<HTMLInputElement>(null);

	const onSubmitHandler = (e: any) => {
		e.preventDefault();
		onSearch(searchValueRef.current?.value)
	}

	return (
		<div className={classes["search-bar"]}>
			<form className={classes["search-bar__container"]} onSubmit={onSubmitHandler}>
				<input ref={searchValueRef} className={classes["search-bar__input"]} placeholder='Search Bookmarks...' type="text" />
				<button className={classes["search-bar__btn"]}>
					<IoSearch />
				</button>
			</form>
		</div>
	)
}

export default SearchBar;