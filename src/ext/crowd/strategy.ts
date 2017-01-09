import * as passport from 'passport';

import { requestJSON } from '@encore/util';
import { CrowdStrategyConfig } from './types';
import { AppError } from '@encore/express';
import { Strategy as LocalStrategy } from 'passport-local';
import { Context } from '@encore/context';

export function CrowdStrategy<T>(cls: new () => T, config: CrowdStrategyConfig) {

  async function login(username: string, password: string) {
    try {
      let crowdUser = await requestJSON({
        method: 'POST',
        auth: `${config.application}:${config.password}`,
        url: `${config.baseUrl}/rest/usermanagement/latest/authentication?username=${username}`
      }, { value: password });
      Context.get().user = crowdUser;
      return crowdUser;
    } catch (err) {
      throw new AppError(err);
    }
  }

  // used to serialize the user for the session
  passport.serializeUser((user: T, done: Function) => done(null, (user as any)[config.usernameField]));

  // used to deserialize the user
  passport.deserializeUser(async (username: string, done: (err: any, user?: T) => void) => {
    try {
      let crowdUser = await requestJSON<T, any>({
        url: `${config.baseUrl}/rest/usermanagement/latest/user?username=${username}`,
        auth: `${config.application}:${config.password}`,
      });
      done(null, crowdUser);
    } catch (err) {
      done(err);
    }
  });

  passport.use('local', new LocalStrategy({
    usernameField: config.usernameField,
    passwordField: config.passwordField,
    passReqToCallback: true // allows us to pass back the entire request to the callback
  }, async function (req, email, password, done) {
    try {
      let res = await login(email, password);
      if (req.passportOptions.successRedirect) {
        this.success(res);
      } else {
        done(null, res);
      }
    } catch (e) {
      if (req.passportOptions.failureRedirect) {
        this.fail(e);
      } else {
        done(e);
      }
    }
  }));

  return { login };
}