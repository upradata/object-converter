export function isArray(value: any) {
    return typeof value === 'object' && value !== null && typeof value !== 'function' && isLength(value.length);
}


function isLength(value: any) {
    return typeof value === 'number' &&
        value > -1 && value % 1 === 0 && value <= Number.MAX_SAFE_INTEGER;
}
