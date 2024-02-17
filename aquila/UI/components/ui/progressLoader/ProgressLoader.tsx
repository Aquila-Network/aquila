import React, { FC, useContext, useState } from 'react';
import classes from './ProgressLoader.module.scss';

interface ProgressLoaderCtxValue { status: boolean, setLoader: (status: boolean) => void};

const ProgressLoaderCtx = React.createContext<ProgressLoaderCtxValue | undefined>(undefined)

export const useProgressLoader = () => {
    const context =  useContext(ProgressLoaderCtx);
    if(!context) {
        throw new Error("useProgressLoader must use inside a ProgressLoaderProvider");
    }
    return context;
}

interface ProgressLoaderProviderProps {
    children: React.ReactNode;
}

const ProgressLoader = () => {
    const { status } = useProgressLoader();
    if (!status) return null; 
    return (
        <div className={classes["progress-loader"]}>
            <div className={classes["progress-loader__item"]}></div>
        </div>
    )
}

export const ProgressLoaderProvider: FC<ProgressLoaderProviderProps> = ({ children }) => {
    const [status, setLoader] = useState(false);

    return (<ProgressLoaderCtx.Provider value={{ status, setLoader}}>
        <ProgressLoader />
        {children}
    </ProgressLoaderCtx.Provider>
    );
}
