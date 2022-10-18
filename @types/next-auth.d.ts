import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface User {
        customerId: string;
        firstName: string;
        lastName: string;
        accountStatus: string;
        token: string;
    }

    interface Session {
       user: {
            customerId: string;
            firstName: string;
            lastName: string;
            accountStatus: string;
            token: string;
       } & DefaultSession 
    } 
}

declare module "next-auth/jwt" {
    interface JWT {
        customerId: string;
        firstName: string;
        lastName: string;
        accountStatus: string;
        token: string;
    }
}