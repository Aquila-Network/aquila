import { FC, useEffect, useState } from "react";
import { Oval } from 'react-loader-spinner';
import { FiX } from 'react-icons/fi';

import { AppState } from "../../../store";
import { Collection } from "../../../store/slices/types/Collection";
import { Customer } from "../../../store/slices/types/Customer";
import MainLayout from "../../layout/main/MainLayout"
import Container from "../../ui/layout/Container";
import classes from "./HomePageWrapper.module.scss";
import SearchBar from "./SearchBar";
import SearchPageProfile from "./SearchPageProfile";
import SearchResults from "./SearchResults";

interface HomePageWrapperProps {
    customer: Customer | null;
    collection: Collection | null;
    bookmarksState: AppState["getLoggedInCustBookmarksByCollectionId"];
    onSearch: Function;
    onClickNextPage: Function;
    onClickPrevPage: Function;
}

const HomePageWrapper: FC<HomePageWrapperProps> = (props) => {
    const { collection, customer, bookmarksState, onSearch, onClickNextPage, onClickPrevPage } = props;
    const [hasNext, setHasNext] = useState(false);
    const [hasPrev, setHasPrev] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    
    useEffect(() => {
        if(bookmarksState.currentPage && bookmarksState.totalPages) {
            if(bookmarksState.currentPage < bookmarksState.totalPages) {
                setHasNext(true);
            }else {
                setHasNext(false);
            }
            if(bookmarksState.currentPage > 1) {
                setHasPrev(true)
            }else {
                setHasPrev(false)
            }
        }
    }, [bookmarksState])

    return (
        <MainLayout>
            <Container>
                <div className={classes["home-page"]}>
                    <section className={classes["home-page__search-area"]}>
                        <div className={classes["home-page__search-bar"]}>
                            <SearchBar onSearch={onSearch} />
                        </div>
                        <div className={classes["home-page__search-results"]}>
                            {bookmarksState.status === "pending" && <Oval height={30} width="100%" strokeWidth={5} color="#0FBD86" strokeWidthSecondary={5} />}
                            {bookmarksState.bookmarks && <SearchResults 
                                totalRecords={bookmarksState.totalRecords}
                                onClickNextPage={onClickNextPage}
                                onClickPrevPage={onClickPrevPage}
                                hasPrev={hasNext}
                                hasNext={hasPrev}
                                bookmarks={bookmarksState.bookmarks}
                                />}
                        </div>
                    </section>
                    <section className={`${classes["home-page__sidebar"]} ${!showSidebar? classes["home-page__sidebar--close"] : ''}`}>
			           <button onClick={() => setShowSidebar(false)} className={classes["home-page__sidebar-close"]}><FiX /></button>
                       {collection && customer && <SearchPageProfile collection={collection} customer={customer} />}
                    </section>
                </div>
            </Container>
        </MainLayout>
    )
}

export default HomePageWrapper;