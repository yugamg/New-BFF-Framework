export interface StartAuthenticationParams {
  scope: string;
}

export interface StartAuthenticationResponse {
  authenticationToken?: string;
  expiresIn?: number;
}

export interface ClassicValidateParams {
  login: string;
  password: string;
  cookies?: string;
}

export interface ClassicValidateResponse {
  authStatus: string;
  user?: string;
  authCookie?: {
    Name: string;
    Value: string;
  };
}

export interface AppTokenResponse {
  token: string;
  expires: number;
  authStatus: string;
}

export interface SendAccessKeyParams {
  email: string;
  cookies?: string;
}

export interface SendAccessKeyResponse {
  authStatus: string;
  login?: string;
  flow?: string;
}
