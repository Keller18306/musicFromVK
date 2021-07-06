export function deepClone(obj: { [key: string]: any }) {
    const clObj: { [key: string]: any } = {};
    for (const i in obj) {
        if(Array.isArray(obj[i])) {
            clObj[i] = obj[i].slice();
            continue;
        }
        if (obj[i] instanceof Object) {
            clObj[i] = deepClone(obj[i]);
            continue;
        }
        clObj[i] = obj[i];
    }
    return clObj;
}