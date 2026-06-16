export function getQueryParams(){
    const url = new URL(window.location.href);
    const params = Object.fromEntries(url.searchParams);
    return params;
}
export function createQueryString(params){
    const parameters = [];
    if(params.category){
        parameters.push(`category=${params.category}`);
    }
    if(params.name){
        parameters.push(`name=${params.name}`);
    }
    if(params.sort){
        parameters.push(`sort=${params.sort}`);
    }
    if(params.minPrice){
        parameters.push(`minPrice=${params.minPrice}`);
    }
    if(params.maxPrice){
        parameters.push(`maxPrice=${params.maxPrice}`);
    }
    if(params.isFeatured){
        parameters.push(`isFeatured=${params.isFeatured}`);
    }
    if(params.limit){
        parameters.push(`limit=${params.limit}`);
    }
    if(params.page){
        parameters.push(`page=${params.page}`);
    }

    const query = parameters.length > 0 ? `?${parameters.join('&')}` : '';
    return query;
}

export function updateUrlParameters(params){
    const url = new URL(window.location.href);
    for(const [key, value] of Object.entries(params)){
        if(value.length > 0)
            url.searchParams.set(key, value);
        else
            url.searchParams.delete(key);
    }
    window.history.replaceState(null, '', url.toString());
}

export default createQueryString;