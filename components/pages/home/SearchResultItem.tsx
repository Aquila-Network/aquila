import { FC } from 'react';
import classes from './SearchResultItem.module.scss';

interface SearchResultItemProps {
	title: string;
	url: string;
	summary: string;
}

const SearchResultItem: FC<SearchResultItemProps> = (props) => {
	const { title, url, summary } = props;
	return (
		<div className={classes["search-result-item"]}>
			<h3 className={classes['search-result-item__title']}>{title}</h3>
			<p className={classes['search-result-item__meta-info']}>Updated a mounth ago</p>
			<p className={classes['search-result-item__site-desc']}>{summary}</p>
			<a className={classes['search-result-item__site-link']} href={url}>{url}</a>
		</div>
	);
}

export default SearchResultItem;