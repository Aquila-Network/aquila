import dotenv from 'dotenv';
import { Service } from 'typedi';

@Service()
export class ConfigService {
  constructor() {
    this.loadEnv();
  }

  private loadEnv() {
    let envFile;
    const env = process.env.NODE_ENV || 'development';
    switch (env) {
      case 'production':
        envFile = '.env.production';
        break;
      case 'test':
        envFile = '.env.test';
        break;
      default:
        envFile = '.env.development';
    }
    const path = `${__dirname}/../../${envFile}`;
    dotenv.config({ path });
  }

  get<T>(key: string, defaultValue?: T): T {
    let data: unknown = process.env[key];
    if (!data && !defaultValue) {
      throw new Error(`Environment variable not found [${key}]`);
    }
    if (!data && defaultValue) {
      data = defaultValue;
    }
    return data as T;
  }
}