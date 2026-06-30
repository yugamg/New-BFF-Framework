export declare const metaJsonSchema: {
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
export declare const errorBodyJsonSchema: {
    readonly type: "object";
    readonly required: readonly ["code", "message"];
    readonly properties: {
        readonly code: {
            readonly type: "string";
        };
        readonly message: {
            readonly type: "string";
        };
        readonly details: {};
    };
    readonly additionalProperties: false;
};
export declare function createSuccessJsonSchema(dataSchema: Record<string, unknown>): {
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
export declare function createErrorJsonSchema(description: string, code: string, message: string): {
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
export declare const badRequestJsonSchema: {
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
export declare const unauthorizedJsonSchema: {
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
export declare const forbiddenJsonSchema: {
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
export declare const notFoundJsonSchema: {
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
export declare const internalServerErrorJsonSchema: {
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
//# sourceMappingURL=schema.helper.d.ts.map