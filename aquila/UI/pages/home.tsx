import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import HomePageWrapper from "../components/pages/home/HomePageWrapper";
import { useProgressLoader } from "../components/ui/progressLoader/ProgressLoader";
import { useAppSelector, useAppDispatch } from "../store";
import {getLoggedInCustBookmarksByCollectionId, GetLoggedInCustBookmarksByCollectionIdInputOptions, selectGetLoggedInCustBookmarksByCollectionId } from "../store/slices/bookmark/getLoggedInCustBookmarksByCollectionId";
import { selectGetLoggedInCustCollections } from "../store/slices/collection/getLoggedInCustCollections";
import { isCollectionSubscribed, selectIsCollectionSubscribed } from "../store/slices/collection/isCollectionSubscribed";
import { selectSubscribeCollectionById, subscribeCollectionById } from "../store/slices/collection/subscribeCollectionById";
import { selectUnSubscribeCollectionById, unSubscribeCollectionById } from "../store/slices/collection/unSubscribeCollectionById";
import { getCurrentLoggedInCustomer, selectGetCurrentLoggedInCustomer } from "../store/slices/customer/getCurrentLoggedInCustomer";

const HomePage = () => {
    const currentLoggedInCustomerState = useAppSelector(selectGetCurrentLoggedInCustomer);
    const getLoggedInCustCollections = useAppSelector(selectGetLoggedInCustCollections)
    const getLoggedInCustBookmarksState = useAppSelector(selectGetLoggedInCustBookmarksByCollectionId);
    const isCollectionSubscribedState = useAppSelector(selectIsCollectionSubscribed);
    const subscribeCollectionByIdState = useAppSelector(selectSubscribeCollectionById);
    const unSubscribeCollectionByIdState = useAppSelector(selectUnSubscribeCollectionById);

    const dispatch = useAppDispatch();
    const [query, setQuery] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const { setLoader } = useProgressLoader();

    useEffect(() => {
        dispatch(getCurrentLoggedInCustomer())
    }, [dispatch])

    useEffect(() => {
        if(getLoggedInCustCollections.collecitons) {
            dispatch((isCollectionSubscribed( getLoggedInCustCollections.collecitons[0].id)))
        }
    }, [dispatch, getLoggedInCustCollections.collecitons, subscribeCollectionByIdState.collectionSubscription, unSubscribeCollectionByIdState.collectionSubscription])

    useEffect(() => {
        if(getLoggedInCustCollections.collecitons && getLoggedInCustCollections.collecitons.length > 0) {
            const options: GetLoggedInCustBookmarksByCollectionIdInputOptions = {
                collectionId: getLoggedInCustCollections.collecitons[0].id,
                page: currentPage
            }
            if(query) {
                options.query = query;
            }
            dispatch(getLoggedInCustBookmarksByCollectionId(options))
        }
    }, [dispatch, getLoggedInCustCollections.collecitons, query, currentPage])

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

    const onSubscribeHandler =  async (collectionId: string) => {
        try {
            setLoader(true);
            const resp = await dispatch(subscribeCollectionById(collectionId)).unwrap();
            toast("Collection Subscribed Successfully", { position: "top-center"});
            setLoader(false);
            return resp;
        }catch(e: any) {
            setLoader(false);
            toast(e.message || "Something went wrong!", { position: "top-center", type: "error"});
            return false;
        }
    }

    const onUnSubscribeHandler = async (collectionId: string) => {
        try {
            setLoader(true);
            const resp = await dispatch(unSubscribeCollectionById(collectionId)).unwrap();
            toast("Collection Unsubscribed Successfully", { position: "top-center"});
            setLoader(false);
            return resp;
        }catch(e: any) {
            setLoader(false);
            let message = e.message || "Something went wrong!";
            toast(message, { position: "top-center"});
            return false;
        }
    }

    return (
        <HomePageWrapper 
            collection={getLoggedInCustCollections.collecitons && getLoggedInCustCollections.collecitons.length > 0 ? getLoggedInCustCollections.collecitons[0] : null}
            customer={currentLoggedInCustomerState.customer}
            bookmarksState={getLoggedInCustBookmarksState}
            onSubscribe={onSubscribeHandler}
            onUnsubscribe={onUnSubscribeHandler}
            isCollectionSubscribed={isCollectionSubscribedState.isSubscribed}
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