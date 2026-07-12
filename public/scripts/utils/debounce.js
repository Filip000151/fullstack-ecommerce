export function debounce(func, delay){
    let timeoutId = null;

    return function(...args){
        if(timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
            timeoutId = null;
        }, delay);
    };
}

export default debounce;