export { default } from 'next-auth/middleware';

export const config = {
	matcher: ['/home', '/profile', '/subscription', '/account/edit-profile']
}