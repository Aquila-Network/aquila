import { unstable_getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { useSelector } from "react-redux";
import HomePageWrapper from "../components/pages/home/HomePageWrapper";
import { wrapper, AppStore, useAppSelector } from "../store";
import auth, { selectAuth, signIn } from "../store/slices/auth";
import { authOptions } from "./api/auth/[...nextauth]";

const HomePage = () => {
    const authState = useAppSelector(selectAuth);
    return (
        <HomePageWrapper />
    );
}

export const getServerSideProps = wrapper.getServerSideProps(store=> async (ctx) => {
    const session = await unstable_getServerSession(ctx.req, ctx.res, authOptions);
    if(session) {
        store.dispatch(signIn({  token: session?.user.token, accountStatus: session?.user.accountStatus, customer: {
            firstName: session?.user.firstName,
            lastName: session?.user.lastName,
            customerId: session?.user.customerId
        }}))
    }
    return {props: {}};
});
export default HomePage;