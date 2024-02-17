import Avatar from 'boring-avatars';
import Link from 'next/link';
import { FC } from 'react';
import classes from './Collection.module.scss';

interface CollectionProps {
    name: string;
    collectionId: string;
}

const Collection: FC<CollectionProps> = (props) => {
    const { name, collectionId } = props;
    return (
        <div className={classes["collection"]} >
            <Avatar name={name} />
            <Link href={`/collection/bookmark/${collectionId}`}>
                <a rel="nofollow" className={classes["collection__link"]}><h3 className={classes["collection__title"]}>{name}</h3></a>
            </Link>
        </div>
    )
}

export default Collection;