import { FC } from 'react';
import { ToastContainer} from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { ProgressLoaderProvider } from '../../ui/progressLoader/ProgressLoader';


interface BaseLayoutProps {
    children: React.ReactNode;
}

const BaseLayout: FC<BaseLayoutProps> = (props) => {
    return (
        <>
            <ProgressLoaderProvider>
            {props.children}
            <ToastContainer />
            </ProgressLoaderProvider>
        </>
    )
}

export default BaseLayout;