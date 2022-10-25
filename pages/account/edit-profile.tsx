import { useEffect } from "react";
import EditProfileWrapper from "../../components/pages/account/editProfile/EditProfileWrapper";
import { useAppDispatch, useAppSelector } from "../../store";
import { selectAuth } from "../../store/slices/auth";
import { getCurrentLoggedInCustomer, selectGetCurrentLoggedInCustomer } from "../../store/slices/customer/getCurrentLoggedInCustomer";

const EditProfilePage = () => {
    const dispatch = useAppDispatch();
    const currentLoggedInCustomer = useAppSelector(selectGetCurrentLoggedInCustomer);
    const authState = useAppSelector(selectAuth);

    useEffect(() => {
        dispatch(getCurrentLoggedInCustomer())
    }, [])

    return (
        <EditProfileWrapper authState={authState} currentLoggedInCustomerState={currentLoggedInCustomer} />
    )
}

export default EditProfilePage;