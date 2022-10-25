import axios from "axios";
import { getSession } from "next-auth/react";
import { store } from "../store";


const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_AQUILA_API_URL,
});

api.interceptors.request.use(async (config) => {
    const authState = store.getState().auth;
    let accessToken = authState.token;
    // console.log(authState);
    if(!accessToken && authState.status === "idle") {
        const session = await getSession();
        // console.log(session, "Output");
        if(session) {
            accessToken = session?.user.token || null;
        }
    }
    if(config.headers && accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
})

export default api;