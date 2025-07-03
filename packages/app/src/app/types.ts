export type LoaderResponse<T = unknown> = {
    success: boolean;
    data?: T;
    error?: string | Error;
}