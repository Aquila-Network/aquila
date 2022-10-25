import Image from 'next/image';
import classes from './Discover.module.scss';

import DiscoverImg from '../../../public/img/aquila-discover.png';

const Discover = () => {
    return (
        <div className={classes.discover} >
            <div className={classes["discover__text-area"]}>
                <h4 className={classes["discover__title"]}>Discover new topics and people</h4>
                <p className={classes["discover__desc"]}>Become a fan of your favorite curators.
Maintain a pool of specialists and create a search engine out of it.</p>
            </div>
            <div className={classes["discover__img-area"]}>
                <Image alt="Discover new Topics in Aquila" src={DiscoverImg} />
            </div>
        </div>
    )
}

export default Discover;