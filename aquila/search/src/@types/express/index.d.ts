import { AccountStatus } from "../../service/dto/AuthServiceDto";

declare global {
	namespace Express {
		interface Request {
			token?: string;
			jwtTokenPayload?: {
				customerId: string;
				accountStatus: AccountStatus
			}
		}
	}
}