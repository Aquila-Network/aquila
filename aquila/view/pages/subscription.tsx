import { useEffect, useState } from "react";

import SubscriptionPageWrapper from "../components/pages/subscription/SubscriptionPageWrapper";
import { useAppSelector, useAppDispatch } from "../store";
import { getCustomerSubscriptions, GetCustomerSubscriptionsInputOptions, selectGetCustomerSubscriptions } from "../store/slices/collection/getCustomerSubscriptions";
import { getSubscribedCollections, selectGetSubscribedCollections } from "../store/slices/collection/getSubscribedCollections";

const SubscriptionPage = () => {
    const getCustomerSubscriptionsState = useAppSelector(selectGetCustomerSubscriptions);
    const getSubscribedCollectionsState = useAppSelector(selectGetSubscribedCollections);
    const dispatch = useAppDispatch();
    const [query, setQuery] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(getSubscribedCollections())
    }, [dispatch])

    useEffect(() => {
            const options: GetCustomerSubscriptionsInputOptions = {
                page: currentPage
            }
            if(query) {
                options.query = query;
            }
            dispatch(getCustomerSubscriptions(options))
    }, [dispatch, query, currentPage])

    const onSearchHandler = (data: string) => {
        if(data) {
            setQuery(data);
            setCurrentPage(1);
        }else {
            setQuery(null);
        }
    }

    const onClickNextPageHandler = () => {
        setCurrentPage(currentPage + 1)
    }

    const onClickPrevPageHandler = () => {
        setCurrentPage(currentPage - 1)
    }

    return (
        <SubscriptionPageWrapper
            subscribedCollections={getSubscribedCollectionsState.collecitons}
            bookmarksState={getCustomerSubscriptionsState}
            onClickNextPage={onClickNextPageHandler}
            onClickPrevPage={onClickPrevPageHandler}
            onSearch={onSearchHandler}
        />
    )
}

export default SubscriptionPage;