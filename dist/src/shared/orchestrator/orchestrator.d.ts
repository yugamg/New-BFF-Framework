import { type OrchestratorOptions, type TaskResult, type TaskWithRetry } from "../orchestrator/orchestrator.types";
import type { FastifyRequest } from "fastify";
export declare function orchestrator(tasks: TaskWithRetry[], options?: OrchestratorOptions, request?: FastifyRequest): Promise<TaskResult[]>;
//# sourceMappingURL=orchestrator.d.ts.map