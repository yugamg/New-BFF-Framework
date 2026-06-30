import { badRequestJsonSchema, forbiddenJsonSchema, internalServerErrorJsonSchema, notFoundJsonSchema, unauthorizedJsonSchema } from "../../shared/schema/schema.helper";
import { z } from "zod";
export declare const ClassicSigninRequestSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, "strict", z.ZodTypeAny, {
    username: string;
    password: string;
}, {
    username: string;
    password: string;
}>;
export declare const classicSigninRequestJsonSchema: {
    readonly type: "object";
    readonly required: readonly ["username", "password"];
    readonly properties: {
        readonly username: {
            readonly type: "string";
        };
        readonly password: {
            readonly type: "string";
        };
    };
    readonly additionalProperties: false;
};
export declare const classicSigninResponseJsonSchema: {
    readonly type: "object";
    readonly required: readonly ["authStatus"];
    readonly properties: {
        readonly authStatus: {
            readonly type: "string";
        };
    };
    readonly additionalProperties: false;
};
export declare const classicSigninSuccessJsonSchema: {
    readonly type: "object";
    readonly required: readonly ["success", "data", "error", "meta"];
    readonly properties: {
        readonly success: {
            readonly type: "boolean";
            readonly const: true;
        };
        readonly data: Record<string, unknown>;
        readonly error: {
            readonly type: "null";
        };
        readonly meta: {
            readonly type: "object";
            readonly required: readonly ["requestId", "timestamp"];
            readonly properties: {
                readonly requestId: {
                    readonly type: "string";
                };
                readonly timestamp: {
                    readonly type: "string";
                };
            };
            readonly additionalProperties: false;
        };
    };
    readonly additionalProperties: false;
};
export declare const classicSignin401JsonSchema: {
    readonly description: string;
    readonly type: "object";
    readonly required: readonly ["success", "data", "error", "meta"];
    readonly properties: {
        readonly success: {
            readonly type: "boolean";
            readonly const: false;
        };
        readonly data: {
            readonly type: "null";
        };
        readonly error: {
            readonly properties: {
                readonly code: {
                    readonly type: "string";
                    readonly example: string;
                };
                readonly message: {
                    readonly type: "string";
                    readonly example: string;
                };
                readonly details: {};
            };
            readonly type: "object";
            readonly required: readonly ["code", "message"];
            readonly additionalProperties: false;
        };
        readonly meta: {
            readonly type: "object";
            readonly required: readonly ["requestId", "timestamp"];
            readonly properties: {
                readonly requestId: {
                    readonly type: "string";
                };
                readonly timestamp: {
                    readonly type: "string";
                };
            };
            readonly additionalProperties: false;
        };
    };
    readonly additionalProperties: false;
};
export { badRequestJsonSchema, forbiddenJsonSchema, internalServerErrorJsonSchema, notFoundJsonSchema, unauthorizedJsonSchema, };
//# sourceMappingURL=auth.schema.d.ts.map