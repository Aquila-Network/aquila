import SearchResultItem from "./SearchResultItem";
import classes from './SearchResults.module.scss';

const SearchResults = () => {
	return (
		<div className={classes["search-result"]}>
			<div className={classes["search-result__header-info"]}>
				<p className={classes["search-result__header-info-desc"]}>Received 31 results in 1.0006 seconds</p>
			</div>
			<div className={classes["search-result__results"]}>
				<div className={classes["search-result__item"]}>
					<SearchResultItem />
				</div>
				<div className={classes["search-result__item"]}>
					<SearchResultItem />
				</div>
				<div className={classes["search-result__item"]}>
					<SearchResultItem />
				</div>
				<div className={classes["search-result__item"]}>
					<SearchResultItem />
				</div>
				<div className={classes["search-result__item"]}>
					<SearchResultItem />
				</div>
			</div>
		</div>
	);
}

export default SearchResults;