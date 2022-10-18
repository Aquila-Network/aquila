import NextAuth, { NextAuthOptions, User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import jwt from 'jsonwebtoken';

import api from '../../../utils/api';

interface AuthPayload {
	accountStatus: string;
	customerId: string;
	firstName: string;
	lastName: string;
}

export const authOptions: NextAuthOptions = {
	providers: [
		Credentials({
			name: 'credentials',
			credentials: { secretKey: {}},
			async authorize(credentials){
				let token = '';
				let response;
				try{
					response = await api.post('/auth/login', {
						secretKey: credentials?.secretKey
					});
					console.log(response.data);
					token = response.data?.token;
				}catch(e: unknown) {
					throw new Error(response?.data.message || "Something went wrong");
				}
				if(!token) {
					throw new Error('Something went wrong');
				}
				const data = jwt.decode(token) as unknown as AuthPayload;
				return {
					customerId: data.customerId,
					firstName: data.firstName,
					lastName: data.lastName,
					accountStatus: data.accountStatus,
					token: token
				} as User;
				
			}
		})
	],
	callbacks: {
		session({ session, token}) {
			if(token.customerId) {
				session.user.customerId = token.customerId;
			}
			if(token.firstName) {
				session.user.firstName = token.firstName;
			}
			if(token.lastName) {
				session.user.lastName = token.lastName;
			}
			if(token.accountStatus) {
				session.user.accountStatus = token.accountStatus;
			}
			if(token.token) {
				session.user.token = token.token;
			}
			return session;
		},
		jwt({ token, user}) {
			if(user) {
				token.customerId = user.customerId;
				token.firstName = user.firstName;
				token.lastName = user.lastName;
				token.accountStatus = user.accountStatus;
				token.token = user.token;
			}
			return token;
		}
	},
	pages: {
		signIn: '/sign-in'
	}
};

export default NextAuth(authOptions)