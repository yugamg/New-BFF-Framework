import type { HttpRequestOptions, HttpResponse } from "../http/http.types";
export declare class HttpClient {
    private readonly baseUrl;
    private readonly defaultTimeoutMs;
    constructor(baseUrl: string, defaultTimeoutMs: number);
    request<T>(path: string, options?: HttpRequestOptions): Promise<HttpResponse<T>>;
    buildUrl(path: string, queryParams?: Record<string, string | undefined>): string;
    private execute;
    private mapError;
    private parseJson;
}
//# sourceMappingURL=http.client.d.ts.map