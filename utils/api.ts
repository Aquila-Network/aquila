import axios, { AxiosRequestConfig } from "axios";
import { store } from "../store";

console.log(process.env.NEXT_PUBLIC_API_URL);

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_AQUILA_API_URL,
});

// api.interceptors.request.use((config) => {
//     const accessToken = store.getState().auth.authToken;
//     if(config.headers && accessToken) {
//         config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
// })

export default api;