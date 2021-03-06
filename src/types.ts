export interface AuthContext<U> {
  id: string;
  permissions: Set<string>;
  principal: U;
}

export const ERR_FORBIDDEN = 'User is forbidden';
export const ERR_UNAUTHENTICATED = 'User is unauthenticated';
export const ERR_AUTHENTICATED = 'User is authenticated';
export const ERR_INVALID_AUTH = 'Unable to authenticate';
export const ERR_INVALID_CREDS = 'Unable to authenticate, credentials are invalid';
export const ERR_MISSING_PASSWORD = 'Missing password exception';
export const ERR_INVALID_PASSWORD = 'Invalid password';