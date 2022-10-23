import { FC } from 'react';
import { ToastContainer} from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';


interface BaseLayoutProps {
    children: React.ReactNode;
}

const BaseLayout: FC<BaseLayoutProps> = (props) => {
    return (
        <>
            {props.children}
            <ToastContainer />
        </>
    )
}

export default BaseLayout;