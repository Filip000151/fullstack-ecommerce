export function debounce(func, delay){
    let timeoutId = null;

    const debouncedFunc = function(...args){
        if(timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
            timeoutId = null;
        }, delay);
    };

    debouncedFunc.cancel = function(){
        if(timeoutId){
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    }

    debouncedFunc.isPending = function(){
        if(timeoutId) return true;
        return false;
    }

    return debouncedFunc;
}

export default debounce;