import { FC } from "react";
import { Bookmark } from "../../../store/slices/types/Bookmark";
import SearchResultItem from "./SearchResultItem";
import classes from './SearchResults.module.scss';

interface SearchResultsProps {
	bookmarks: Bookmark[];
	hasNext: boolean;
	hasPrev: boolean;
	onClickNextPage: Function;
	onClickPrevPage: Function;
	totalRecords: number | null;
}

const SearchResults: FC<SearchResultsProps> = (props) => {
	const { bookmarks, hasNext, hasPrev, onClickNextPage, onClickPrevPage, totalRecords } = props;

	const onNextPageHandler = (e: any) => {
		e.preventDefault();
		onClickNextPage()
	}

	const onPrevPageHandler = (e:any) => {
		e.preventDefault();
		onClickPrevPage()
	}


	return (
		<div className={classes["search-result"]}>
			<div className={classes["search-result__header-info"]}>
				{totalRecords && <p className={classes["search-result__header-info-desc"]}>Received {totalRecords} results</p>}
			</div>
			<div className={classes["search-result__results"]}>
				{bookmarks.map((bookmark, index) => (
				<div key={index} className={classes["search-result__item"]}>
					<SearchResultItem
						title={bookmark.title}
						url={bookmark.url}
						summary={bookmark.summary}
					/>
				</div>
				))}
			</div>
			<div className={classes["search-result__pagination"]}>
					{hasNext && <a onClick={onPrevPageHandler} className={classes["search-result__pagination-link"]} href="#">Previous</a>}
					{hasPrev && <a onClick={onNextPageHandler} className={classes["search-result__pagination-link"]} href="#">Next</a>}
			</div>
		</div>
	);
}

export default SearchResults;