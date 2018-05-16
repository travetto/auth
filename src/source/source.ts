import { IStrategyOptions } from 'passport-local';

export abstract class AuthSource<U, T extends IStrategyOptions = IStrategyOptions> {
  config: T;

  abstract getUser(id: string): Promise<U>;

  abstract doLogin(email: string, password: string): Promise<U>;

  register?(user: U, password: string): Promise<U>;

  changePassword?(username: string, password: string, oldPassword?: string): Promise<U>;
}