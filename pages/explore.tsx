import { FC } from "react";
import ExplorePageWrapper from "../components/pages/explore/ExplorePageWrapper";
import { Collection } from "../store/slices/types/Collection";
import { wrapper } from '../store/index';
import api from "../utils/api";
import { selectGetFeaturedCollections, setGetFeaturedCollections } from '../store/slices/collection/getFeaturedCollections';
import { useSelector } from "react-redux";

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
    return (
        <ExplorePageWrapper featuredCollectionsState={featuredCollectionsSate} />
    )
}

export const getStaticProps = wrapper.getStaticProps((store) => async () => {
    const response = await api.get('/collection/public/featured');
    const featuredCollections = response.data;
    store.dispatch(setGetFeaturedCollections(featuredCollections))
    return {
        props: {}
    }
})

export default ExplorePage;