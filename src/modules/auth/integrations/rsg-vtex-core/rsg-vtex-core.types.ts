export const CUSTOMER_REG_STATUS = {
  REG_CREATED: "REG_CREATED",
  REG_FAILED: "REG_FAILED",
  REG_NOT_FOUND: "REG_NOT_FOUND",
} as const;

export type CustomerRegStatus =
  | (typeof CUSTOMER_REG_STATUS)[keyof typeof CUSTOMER_REG_STATUS]
  | (string & {});

export interface CheckCustomerRegStatusParams {
  email: string;
  token?: string;
}

export interface CheckCustomerRegStatusResponse {
  data: {
    status: CustomerRegStatus;
  };
  error: null | Record<string, unknown>;
}
