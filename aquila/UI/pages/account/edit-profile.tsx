import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { toast, ToastOptions } from 'react-toastify';

import EditProfileWrapper from "../../components/pages/account/editProfile/EditProfileWrapper";
import { useProgressLoader } from "../../components/ui/progressLoader/ProgressLoader";
import { useAppDispatch, useAppSelector } from "../../store";
import { selectAuth } from "../../store/slices/auth";
import { activateCustomer, selectActivateCustomer } from "../../store/slices/customer/activateCustomer";
import { getCurrentLoggedInCustomer, selectGetCurrentLoggedInCustomer } from "../../store/slices/customer/getCurrentLoggedInCustomer";
import { selectUpdateCustomer, updateCustomer, UpdateCustomerData } from "../../store/slices/customer/updateCustomer";

const EditProfilePage = () => {
    const dispatch = useAppDispatch();
    const currentLoggedInCustomer = useAppSelector(selectGetCurrentLoggedInCustomer);
    const authState = useAppSelector(selectAuth);
    const updateCustomerState = useAppSelector(selectUpdateCustomer);
    const activateCustomerState = useAppSelector(selectActivateCustomer);
    const { setLoader } = useProgressLoader();

    useEffect(() => {
        dispatch(getCurrentLoggedInCustomer())
    }, [])

    const updateFormSubmissionHandler = async (data: UpdateCustomerData) => {
        const toastOptions: ToastOptions = {
			position: "top-center",
			hideProgressBar: true,
		}
        setLoader(true);
        if(authState.accountStatus === "TEMPORARY") {
           try {
                const customer = await dispatch(activateCustomer(data)).unwrap()
                setLoader(false);
                const resp = await signIn('credentials',{ redirect: false, secretKey: customer.secretKey });
                if(resp?.ok) {
                    toast("Account Activated Successfully", { ...toastOptions, type: "success"})
                    return true;
                }
            }catch(e) {
                if(e instanceof Error) {
                    toast(e.message, { ...toastOptions, type: "error"});
                }
                setLoader(false);
                return false;
            }
        }else {
            try {
                await dispatch(updateCustomer(data)).unwrap()
                toast("Profile Updated successfully", { ...toastOptions, type: "success"})
                setLoader(false);
                return true;
            }catch(e) {
                if(e instanceof Error) {
                    toast(e.message, { ...toastOptions, type: "error"});
                }
                setLoader(false);
                return false;
            }
        }
    }

    return (
        <EditProfileWrapper 
            activateCustomerState={activateCustomerState}
            updateCustomerState={updateCustomerState}
            onSubmit={updateFormSubmissionHandler}
            authState={authState}
            currentLoggedInCustomerState={currentLoggedInCustomer}
        />
    )
}

export default EditProfilePage;