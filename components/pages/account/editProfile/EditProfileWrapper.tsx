import SettingsLayout from "../../../layout/childLayout/settings/SettingsLayout"
import EditProfileForm from "./EditProfileForm"
import EditProfileHeader from "./EditProfileHeader"

const EditProfileWrapper = () => {
    return (
        <SettingsLayout>
            <EditProfileHeader />
           <EditProfileForm />
        </SettingsLayout>
    )
}

export default EditProfileWrapper