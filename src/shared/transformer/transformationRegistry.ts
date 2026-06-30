import { classicSigninAPI } from "@modules/auth/config/transformationConfig";
import type { TransformConfig } from "@shared/transformer/transform.types";

export const transformationConfigRegistry: Record<string, TransformConfig> = {
  classicSigninAPI,
};
