export const mapToRecord = <Tin, Tout> (
    values: Array<Tin>,
    key: keyof Tin,
    callbackfn: (value: Tin) => Tout,
): Record<string, Tout> => {
    const result: Record<string, Tout> = {};

    for(const value of values) {
        const keyValue = String(value[key]);
        result[keyValue] = callbackfn(value);
    }

    return result;
}