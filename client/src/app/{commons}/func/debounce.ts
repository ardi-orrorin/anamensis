export const createDebounce = function (wait: number) {
    let timeout: NodeJS.Timeout | null = null;
    return function (func: Function) {
        if(timeout) clearTimeout(timeout);
        timeout = setTimeout(()=> {
            func();
        }, wait);
    }
}



