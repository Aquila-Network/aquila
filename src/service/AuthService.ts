import jwt, { Jwt } from 'jsonwebtoken';
import { BadRequestError, UnauthorizedError } from 'routing-controllers';
import { Service } from 'typedi';

import { Customer } from '../entity/Customer';
import { CustomerTemp } from '../entity/CustomerTemp';
import { ConfigService } from '../lib/ConfigService';
import { AccountStatus, JwtPayload } from './dto/AuthServiceDto';

@Service()
export class AuthService {

	public constructor(private configService: ConfigService) {}

	public authenticate(token: string) {
		const secret = this.configService.get('JWT_SECRET');
		try {
		jwt.verify(token, secret);
		}catch(e) {
			throw new UnauthorizedError("Authorization failed");
		}
	}

	public decodeToken(token: string): JwtPayload {
		const decodedToken = jwt.decode(token) as JwtPayload;
		return decodedToken;
	}

	private generateToken(payload: JwtPayload): string {
		const jwtSecret = this.configService.get('JWT_SECRET');
		const expiresIn = this.configService.get('JWT_EXPIRES_IN');
		const token = jwt.sign(payload, jwtSecret, { expiresIn })
		return token;
	}

	public async login(secretKey: string, accountStatus: AccountStatus): Promise<string> {
		if(accountStatus === AccountStatus.PERMANENT) {
			return await this.loginPermanentCustoemr(secretKey);
		}
		return await this.loginTemporaryCustomer(secretKey);
	}

	public async loginPermanentCustoemr(secretKey: string): Promise<string>{
		// check secret is valid
		const customer = await Customer.findOne({ where: {secretKey} })
		if(!customer) {
			throw new BadRequestError("Invalid credentials");
		}

		// if valid secret generate token
		const payload = {
			customerId: customer.id,
			accountStatus: AccountStatus.PERMANENT
		};
		const token = this.generateToken(payload);
		return token;
	}

	public async loginTemporaryCustomer(secretKey: string): Promise<string> {
			// check secret is valid
			const customer = await CustomerTemp.findOne({ where: { secretKey } })
			if(!customer) {
				throw new BadRequestError("Invalid credentials");
			}
	
			// if valid secret generate token
			const payload = {
				customerId: customer.id,
				accountStatus: AccountStatus.TEMPORARY
			};
			const token = this.generateToken(payload);
			return token;
	}
}