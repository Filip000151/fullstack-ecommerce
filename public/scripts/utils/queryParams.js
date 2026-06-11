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

    const query = parameters.length > 0 ? `?${parameters.join('&')}` : '';
    return query;
}

export default getQueryParams;