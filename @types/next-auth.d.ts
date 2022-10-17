import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface User {
        customerId: string;
        accountStatus: string;
        token: string;
    }

    interface Session {
       user: {
            customerId: string;
            accountStatus: string;
            token: string;
       } & DefaultSession 
    } 
}

declare module "next-auth/jwt" {
    interface JWT {
        customerId: string;
        accountStatus: string;
        token: string;
    }
}