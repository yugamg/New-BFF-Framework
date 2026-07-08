import type { ClassicValidateResponse } from "./integrations/vtex-id/vtex-id.types";

export interface ClassicSigninRequest {
  username: string;
  password: string;
}

export interface ClassicSigninResponse {
  authStatus: string;
}

export type ClassicSigninDownstreamResponse = ClassicValidateResponse;

export interface SendAccessKeyLoginRequest {
  email: string;
}
