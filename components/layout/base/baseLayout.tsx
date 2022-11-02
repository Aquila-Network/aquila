import { FC } from 'react';

import { ProgressLoaderProvider } from '../../ui/progressLoader/ProgressLoader';


interface BaseLayoutProps {
    children: React.ReactNode;
}

const BaseLayout: FC<BaseLayoutProps> = (props) => {
    return (
        <>
            <ProgressLoaderProvider>
                {props.children}
            </ProgressLoaderProvider>
        </>
    )
}

export default BaseLayout;