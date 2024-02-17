import { FC, useEffect, useState } from "react";
import { Oval } from 'react-loader-spinner';

import { AppState } from "../../../store";
import { Collection } from "../../../store/slices/types/Collection";
import { Customer } from "../../../store/slices/types/Customer";
import MainLayout from "../../layout/main/MainLayout"
import Container from "../../ui/layout/Container";
import classes from "./SubscriptionPageWrapper.module.scss";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
import SubscribedCollections from "./SubscribedCollections";

interface SubscriptionPageWrapperProps {
    subscribedCollections: Collection[] | null;
    bookmarksState: AppState["getCustomerSubscriptions"];
    onSearch: Function;
    onClickNextPage: Function;
    onClickPrevPage: Function;
}

const SubscriptionPageWrapper: FC<SubscriptionPageWrapperProps> = (props) => {
    const { bookmarksState, onSearch, onClickNextPage, onClickPrevPage, subscribedCollections } = props;
    const [hasNext, setHasNext] = useState(false);
    const [hasPrev, setHasPrev] = useState(false);
    
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
                <div className={classes["subscription-page"]}>
                    <section className={classes["subscription-page__search-area"]}>
                        <div className={classes["subscription-page__search-bar"]}>
                            <SearchBar onSearch={onSearch} />
                        </div>
                        <div className={classes["subscription-page__search-results"]}>
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
                    <section className={classes["subscription-page__sidebar"]}>
                        {Array.isArray(subscribedCollections) &&  <SubscribedCollections collections={subscribedCollections} />}
                    </section>
                </div>
            </Container>
        </MainLayout>
    )
}

export default SubscriptionPageWrapper;