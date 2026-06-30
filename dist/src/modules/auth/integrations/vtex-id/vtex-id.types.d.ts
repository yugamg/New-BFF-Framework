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
//# sourceMappingURL=vtex-id.types.d.ts.map