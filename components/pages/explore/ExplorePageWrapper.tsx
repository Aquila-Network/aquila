import { FC } from "react";
import { AppState } from "../../../store";
import MainLayout from "../../layout/main/MainLayout";
import Container from "../../ui/layout/Container";
import ExploreCategoryList from "./ExploreCategoryList";

interface ExplorePageWrapperProps {
    featuredCollectionsState: AppState["getFeaturedCollections"];
}

const ExplorePageWrapper: FC<ExplorePageWrapperProps> = (props) => {
    return (
        <MainLayout>
            <Container>
                <ExploreCategoryList featuredCollectionsState={props.featuredCollectionsState} />
            </Container>
        </MainLayout>
    )
}

export default ExplorePageWrapper;