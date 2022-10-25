import { FC } from "react";
import { AppState } from "../../../../store";
import MainLayout from "../../main/MainLayout";
import Header from "./Header";

import classes from './SettingsLayout.module.scss';
import Sidebar from "./Sidebar";

interface SettingsLayoutProps {
    children: React.ReactNode;
    authState: AppState["auth"];
}

const SettingsLayout: FC<SettingsLayoutProps> = (props) => {
    return (
        <MainLayout>
            <section className={classes.settings}>
                <section className={classes.settings__header}>
                    <Header authState={props.authState}/>
                </section>
                <section className={classes.settings__body}>
                    <aside className={classes.settings__sidebar}>
                        <Sidebar />
                    </aside>
                    <main className={classes.settings__content}>
                        {props.children}
                    </main>
                </section>
            </section>
        </MainLayout>
    );
}

export default SettingsLayout;