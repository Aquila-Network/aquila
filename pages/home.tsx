import { useEffect, useState } from "react";
import HomePageWrapper from "../components/pages/home/HomePageWrapper";
import { useAppSelector, useAppDispatch } from "../store";
import {getLoggedInCustBookmarks, GetLoggedInCustBookmarksInputOptions, selectGetLoggedInCustBookmarks } from "../store/slices/bookmark/getLoggedInCustBookmarks";
import { selectGetLoggedInCustCollections } from "../store/slices/collection/getLoggedInCustCollections";
import { getCurrentLoggedInCustomer, getCurrentLoggedInCustomerSlice, selectGetCurrentLoggedInCustomer } from "../store/slices/customer/getCurrentLoggedInCustomer";

const HomePage = () => {
    const currentLoggedInCustomerState = useAppSelector(selectGetCurrentLoggedInCustomer);
    const getLoggedInCustCollections = useAppSelector(selectGetLoggedInCustCollections)
    const getLoggedInCustBookmarksState = useAppSelector(selectGetLoggedInCustBookmarks);
    const dispatch = useAppDispatch();
    const [query, setQuery] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(getCurrentLoggedInCustomer())
    }, [dispatch])

    useEffect(() => {
        if(getLoggedInCustCollections.collecitons && getLoggedInCustCollections.collecitons.length > 0) {
            const options: GetLoggedInCustBookmarksInputOptions = {
                collectionId: getLoggedInCustCollections.collecitons[0].id,
                page: currentPage
            }
            if(query) {
                options.query = query;
            }
            dispatch(getLoggedInCustBookmarks(options))
        }
    }, [dispatch, getLoggedInCustCollections.collecitons, query, currentPage])

    const onSearchHandler = (data: string) => {
        if(data) {
            setQuery(data);
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
        <HomePageWrapper 
            collection={getLoggedInCustCollections.collecitons && getLoggedInCustCollections.collecitons.length > 0 ? getLoggedInCustCollections.collecitons[0] : null}
            customer={currentLoggedInCustomerState.customer}
            bookmarksState={getLoggedInCustBookmarksState}
            onClickNextPage={onClickNextPageHandler}
            onClickPrevPage={onClickPrevPageHandler}
            onSearch={onSearchHandler}
        />
    );
}

// export const getServerSideProps = wrapper.getServerSideProps(store=> async (ctx) => {
//     const session = await unstable_getServerSession(ctx.req, ctx.res, authOptions);
//     if(session) {
//         store.dispatch(signIn({  token: session?.user.token, accountStatus: session?.user.accountStatus, customer: {
//             firstName: session?.user.firstName,
//             lastName: session?.user.lastName,
//             customerId: session?.user.customerId
//         }}))
//     }
//     return {props: {}};
// });
export default HomePage;