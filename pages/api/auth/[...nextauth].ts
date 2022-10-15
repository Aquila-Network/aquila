import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: { secretKey: {}},
			async authorize(credentials, req){
				const res = await fetch('/');
				const data = await res.json();
				return data;
			}
		})
	],
	callbacks: {
		// session() {

		// },
		// jwt() {

		// }
	}
})