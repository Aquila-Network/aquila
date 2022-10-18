import classes from './SearchResultItem.module.scss';

const SearchResultItem = () => {
	return (
		<div className={classes["search-result-item"]}>
			<h3 className={classes['search-result-item__title']}>Soveriegn Default, the Debt Ceiling, and the 1 Trillion Coin</h3>
			<p className={classes['search-result-item__meta-info']}>Updated a mounth ago</p>
			<p className={classes['search-result-item__site-desc']}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil soluta architecto optio veniam, aperiam facere, natus aliquam, aliquid et pariatur animi fugit mollitia blanditiis nesciunt nemo doloribus corrupti rem tempore!</p>
			<a className={classes['search-result-item__site-link']} href="#">https://getbootstrap.com/docs/5.1/utilities/shadows/</a>
		</div>
	);
}

export default SearchResultItem;