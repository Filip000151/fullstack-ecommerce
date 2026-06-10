class ApiClient{
    async request(url, options, headerOptions){
        const makeRequest = () => fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...headerOptions
            }
        });

        const response = await makeRequest();

        return response;
    }

    async get(url){
        return this.request(url, {method: 'GET'});
    }

    async post(url, data, headerOptions){
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async patch(url, data, headerOptions){
        return this.request(url, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }

    async delete(url){
        return this.request(url, {method: 'DELETE'});
    }
}

export const apiClient = new ApiClient();

export default apiClient;