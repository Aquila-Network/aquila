export enum AccountStatus {
	TEMPORARY= 'TEMPORARY',
	PERMANENT = 'PERMANENT'
}

export interface JwtPayload {
	customerId: string,
	accountStatus: AccountStatus
}