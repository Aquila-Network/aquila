import MainLayout from "../../layout/main/MainLayout";
import Container from "../../ui/layout/Container";
import ExploreCategoryList from "./ExploreCategoryList";

const ExplorePageWrapper = () => {
    return (
        <MainLayout>
            <Container>
                <ExploreCategoryList />
            </Container>
        </MainLayout>
    )
}

export default ExplorePageWrapper;