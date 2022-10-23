import MainLayout from "../../layout/main/MainLayout"
import Container from "../../ui/layout/Container";

import classes from "./HomePageWrapper.module.scss";
import SearchBar from "./SearchBar";
import SearchPageProfile from "./SearchPageProfile";
import SearchResults from "./SearchResults";

const HomePageWrapper = () => {
    return (
        <MainLayout>
            <Container>
                <div className={classes["home-page"]}>
                    <section className={classes["home-page__search-area"]}>
                        <div className={classes["home-page__search-bar"]}>
                            <SearchBar />
                        </div>
                        <div className={classes["home-page__search-results"]}>
                            <SearchResults />
                        </div>
                    </section>
                    <section className={classes["home-page__sidebar"]}>
                        <SearchPageProfile />
                    </section>
                </div>
            </Container>
        </MainLayout>
    )
}

export default HomePageWrapper;