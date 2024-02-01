export type ValueOf<T> = T[keyof T];

export type Entries<T> = [keyof T, ValueOf<T>][];