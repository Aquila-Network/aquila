import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';

import CollectionBookmarksPageWrapper from "../../../components/pages/collection/bookmark/CollectionBookmarks/CollectionBookmarksPageWrapper";
import { useProgressLoader } from "../../../components/ui/progressLoader/ProgressLoader";
import { useAppDispatch, useAppSelector } from "../../../store";
import { selectAuth } from "../../../store/slices/auth";
import {getPublicBookmarksByCollectionId, GetPublicBookmarksByCollectionIdInputOptions, selectGetPublicBookmarksByCollectionId } from "../../../store/slices/bookmark/getPublicBookmarksByCollectionId";
import { getCollectionById, selectGetCollectionById } from "../../../store/slices/collection/getCollectionById";
import { isCollectionSubscribed, selectIsCollectionSubscribed } from "../../../store/slices/collection/isCollectionSubscribed";
import { selectSubscribeCollectionById, subscribeCollectionById } from "../../../store/slices/collection/subscribeCollectionById";
import { selectUnSubscribeCollectionById, unSubscribeCollectionById, unSubscribeCollectionByIdSlice } from "../../../store/slices/collection/unSubscribeCollectionById";
import { getCustomerById, selectGetCustomerById } from "../../../store/slices/customer/getCustomerById";


const ViewCollectionBookmarks = () => {
    const router = useRouter(); 
    const { collectionId  } = router.query as { collectionId: string};
    const authState = useAppSelector(selectAuth);
    // const currentLoggedInCustomerState = useAppSelector(selectGetCurrentLoggedInCustomer);
    const getCustomerByIdState = useAppSelector(selectGetCustomerById);
    const getPublicCollectionBookmarksState = useAppSelector(selectGetPublicBookmarksByCollectionId);
    const getCollectionByIdState = useAppSelector(selectGetCollectionById);
    const isCollectionSubscribedState = useAppSelector(selectIsCollectionSubscribed);
    const subscribeCollectionByIdState = useAppSelector(selectSubscribeCollectionById);
    const unSubscribeCollectionByIdState = useAppSelector(selectUnSubscribeCollectionById);
    const dispatch = useAppDispatch();
    const [query, setQuery] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const { setLoader } = useProgressLoader();

    useEffect(() => {
        if(authState.isSignedIn) {
            dispatch((isCollectionSubscribed(collectionId)))
        }
    }, [dispatch, authState.isSignedIn, collectionId, subscribeCollectionByIdState.collectionSubscription, unSubscribeCollectionByIdState.collectionSubscription])

    useEffect(() => {
        if(collectionId) {
            dispatch(getCollectionById(collectionId));
        }
    }, [dispatch, collectionId])

    useEffect(() => {
        if(getCollectionByIdState.collection) {
            dispatch(getCustomerById(getCollectionByIdState.collection.customerId))
        }
    }, [dispatch, getCollectionByIdState.collection])

    useEffect(() => {
        const options: GetPublicBookmarksByCollectionIdInputOptions = {
            collectionId: collectionId,
            page: currentPage
        }
        if(query) {
            options.query = query;
        }
        dispatch(getPublicBookmarksByCollectionId(options))
    }, [dispatch, query, currentPage, collectionId])

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
        if(!authState.isSignedIn) {
            router.push('/sign-in');
            return;
        }
        try {
            setLoader(true);
            const resp = await dispatch(subscribeCollectionById(collectionId)).unwrap();
            toast("Collection Subscribed Successfully", { position: "top-center"});
            setLoader(false);
            return resp;
        }catch(e: any) {
            setLoader(false);
            toast(e.message || "Something went wrong!", { position: "top-center"});
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


   return <CollectionBookmarksPageWrapper
        collection={getCollectionByIdState.collection}
        customer={getCustomerByIdState.customer}
        bookmarksState={getPublicCollectionBookmarksState}
        onClickNextPage={onClickNextPageHandler}
        onClickPrevPage={onClickPrevPageHandler}
        onSearch={onSearchHandler}
        onSubscribe={onSubscribeHandler}
        onUnsubscribe={onUnSubscribeHandler}
        isCollectionSubscribed={isCollectionSubscribedState.isSubscribed}
        isSignedIn={authState.isSignedIn}
   />
}

export default ViewCollectionBookmarks;