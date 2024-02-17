import { FC } from "react";
import { Collection } from "../../../store/slices/types/Collection";
import { default as CollectionComponent } from "./Collection"

import classes from './SubscribedCollections.module.scss';

interface SubscribedCollectionsProps {
    collections: Collection[]
}

const SubscribedCollections: FC<SubscribedCollectionsProps> = (props) => {
    const { collections } = props;
    return (
        <div className={classes["subscribed-collections"]}>
            <div className={classes["subscribed-collections__header"]}>
                <h3 className={classes["subscribed-collections__header-title"]}>Subscriptions</h3>
            </div>
            <div className={classes["subscribed-collections__body"]}>
                <ul className={classes["subscribed-collections__list"]}>
                    {collections.map((collection) => (<li key={collection.id} className={classes["subscribed-collections__list-item"]}><CollectionComponent collectionId={collection.id} name={`${collection.customer?.firstName} ${collection.customer?.lastName}`} /></li>))} 
                </ul> 
            </div>
        </div>
    )
}

export default SubscribedCollections;
