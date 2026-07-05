class ApiClient{

    constructor(){
        this.isRefreshing = false;
        this.failedQueue = [];

    }
    
    async request(url, options, headerOptions){
        const requestInfo = {
            url,
            options: {
                ...options,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    ...headerOptions
                }
            }
        };

        const makeRequest = () => fetch(url, requestInfo.options);

        const response = await makeRequest();
        if(!response.ok){
            const jsonData = await response.json();
            return await this.handleErrors(jsonData, requestInfo);
        }
        else{
            const jsonData = await response.json();
            return jsonData;
        }
    }

    async handleErrors(jsonData, requestInfo){
        if(jsonData.code === 'GUEST_ID_MISSING'){
            const guestId = localStorage.getItem('guestId');
            const data = await this.post('/api/auth/guest', {guestId});
            if(data.success){
                if(!guestId || guestId !== data.guestId){
                    localStorage.setItem('guestId', data.guestId);
                }
                return await this.request(requestInfo.url, requestInfo.options);
            }
        }
        else if(jsonData.code === 'TOKEN_EXPIRED'){
            const data = await this.post('/api/auth/refresh');
            if(data.success) return await this.request(requestInfo.url, requestInfo.options);
        }
        return jsonData;
    }

    async get(url){
        return this.request(url, {method: 'GET'});
    }

    async post(url, body, headerOptions){
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    async patch(url, body, headerOptions){
        return this.request(url, {
            method: 'PATCH',
            body: JSON.stringify(body)
        });
    }

    async delete(url){
        return this.request(url, {method: 'DELETE'});
    }
}

export const apiClient = new ApiClient();

export default apiClient;