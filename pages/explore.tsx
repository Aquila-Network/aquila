import { FC } from "react";
import { useSelector } from "react-redux";

import ExplorePageWrapper from "../components/pages/explore/ExplorePageWrapper";
import { Collection } from "../store/slices/types/Collection";
import { wrapper } from '../store/index';
import api from "../utils/api";
import { selectGetFeaturedCollections, setGetFeaturedCollections } from '../store/slices/collection/getFeaturedCollections';
import { selectGetAllPublicCollections, setGetAllPublicCollections } from "../store/slices/collection/getAllPublicCollections";

interface ExplorePageProps {
    featuredCollections: {
        totalRecords: number;
        totalPages: number;
        limit: number;
        collections: Collection[]
    }
}

const ExplorePage: FC<ExplorePageProps> = (props) => {
    const featuredCollectionsSate = useSelector(selectGetFeaturedCollections);
    const publicCollectionsState = useSelector(selectGetAllPublicCollections);
    return (
        <ExplorePageWrapper
            publicCollectionsState={publicCollectionsState}
            featuredCollectionsState={featuredCollectionsSate}
        />
    )
}

export const getStaticProps = wrapper.getStaticProps((store) => async () => {
    const response = await api.get('/collection/public/featured');
    const featuredCollections = response.data;
    const publicCollectionsResp = await api.get('/collection/public');
    const publicCollections = publicCollectionsResp.data;
    store.dispatch(setGetFeaturedCollections(featuredCollections))
    store.dispatch(setGetAllPublicCollections(publicCollections))
    return {
        props: {}
    }
})

export default ExplorePage;