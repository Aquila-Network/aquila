import { FC } from 'react';
import { Oval } from 'react-loader-spinner';
import { AppState } from '../../../../store';

import SettingsLayout from "../../../layout/childLayout/settings/SettingsLayout"
import Alert from '../../../ui/alert/Alert';
import EditProfileForm from "./EditProfileForm"
import EditProfileHeader from "./EditProfileHeader"
import classes from './EditProfileWrapper.module.scss';

interface EditProfileWrapperProps {
    currentLoggedInCustomerState: AppState["getCurrentLoggedInCustomer"];
    authState: AppState["auth"];
    updateCustomerState: AppState["updateCustomer"];
    activateCustomerState: AppState["activateCustomer"];
    onSubmit: Function
}

const EditProfileWrapper: FC<EditProfileWrapperProps> = (props) => {
    return (
        <SettingsLayout authState={props.authState}>
            <EditProfileHeader />
            <div className={classes["edit-profile-wrapper"]}>
                {props.authState.accountStatus === "TEMPORARY" &&
                <div className={classes["edit-profile-wrapper__alert-container"]}>
                    <Alert type="danger" message='Your account is temporary!' />
                </div>
                }
                {props.currentLoggedInCustomerState.status === "pending" && 
                    <Oval height={30} width="100%" strokeWidth={5} color="#0FBD86" strokeWidthSecondary={5} />
                }

                {props.currentLoggedInCustomerState.status === "failed" && 
                    <Alert message={props.currentLoggedInCustomerState.errorMessage|| ""} type="danger" />
                }
                {props.currentLoggedInCustomerState.customer &&
                    <EditProfileForm
                        onSubmit={props.onSubmit}
                        accountStatus={props.authState.accountStatus}
                        customer={props.currentLoggedInCustomerState.customer}
                        activateCustomerState={props.activateCustomerState}
                        updateCustomerState={props.updateCustomerState}
                    />
                }
            </div>
        </SettingsLayout>
    )
}

export default EditProfileWrapper