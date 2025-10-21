export declare class TimeoutError extends Error {
    constructor(message?: string);
}
export declare function withTimeout<T>(task: Promise<T> | (() => Promise<T>), ms: number, opts?: {
    signal?: AbortSignal;
}): Promise<T>;
//# sourceMappingURL=index.d.ts.map