export class TimeoutError extends Error {
    constructor(message = "Operation timed out") {
        super(message);
        this.name = "TimeoutError";
    }
}
export async function withTimeout(task, ms, opts = {}) {
    const { signal } = opts;
    const controller = new AbortController();
    const onAbort = () => controller.abort(signal?.reason);
    if (signal) {
        if (signal.aborted)
            throw signal.reason ?? new DOMException("Aborted", "AbortError");
        signal.addEventListener("abort", onAbort, { once: true });
    }
    try {
        const p = typeof task === "function" ? task() : task;
        const t = setTimeout(() => controller.abort(new TimeoutError()), ms);
        try {
            return await p;
        }
        finally {
            clearTimeout(t);
        }
    }
    finally {
        if (signal)
            signal.removeEventListener("abort", onAbort);
    }
}
//# sourceMappingURL=index.js.map