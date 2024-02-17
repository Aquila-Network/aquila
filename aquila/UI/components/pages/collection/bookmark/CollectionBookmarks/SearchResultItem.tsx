import moment from 'moment';
import { FC } from 'react';
import classes from './SearchResultItem.module.scss';

interface SearchResultItemProps {
	title: string;
	url: string;
	summary: string;
	createdAt: string;
}

const SearchResultItem: FC<SearchResultItemProps> = (props) => {
	const { title, url, summary, createdAt } = props;
	return (
		<div className={classes["search-result-item"]}>
			<h3 className={classes['search-result-item__title']}><a className={classes["search-result-item__title-link"]} rel="nofollow" href={url}>{title}</a></h3>
			<p className={classes['search-result-item__meta-info']}>Updated {moment(createdAt).fromNow()}</p>
			<p className={classes['search-result-item__site-desc']}>{summary.length > 255 ? summary.substring(0, 255)+ '...' : summary}</p>
			<a rel="nofollow" className={classes['search-result-item__site-link']} href={url}>{url}</a>
		</div>
	);
}

export default SearchResultItem;