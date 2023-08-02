export interface Endpoint {
    method: string;
    url: string;
}

export type Endpoints = Record<string, Endpoint>;

export type Headers = Record<string, string>;