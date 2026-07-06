import renderToast from "../utils/toast.js";

class ApiClient{

    constructor(){
        this.isRefreshing = false;
        this.failedQueue = [];
        this.timeout = 20000;
        this.refreshTimeout = 10000;
        this.abortControllers = new Map();
    }
    
    async request(url, options, headerOptions){
        const abortController = new AbortController();
        const requestId = Date.now() + Math.random().toString(36).substring(2, 6);

        this.abortControllers.set(requestId, abortController);


        const requestInfo = {
            url,
            options: {
                ...options,
                credentials: 'include',
                signal: abortController.signal,
                headers: {
                    'Content-Type': 'application/json',
                    ...headerOptions
                }
            }
        };

        const timeoutId = setTimeout(() => {
            abortController.abort();
            this.abortControllers.delete(requestId);
        }, this.timeout);
        
        try {
            const makeRequest = () => fetch(url, requestInfo.options);
            const response = await makeRequest();

            if(!response.ok){
                const jsonData = await response.json();
                return await this.handleErrors(jsonData, makeRequest, requestInfo);
            }

            const jsonData = await response.json();
            return jsonData;
        } catch (error) {
            if(error.name === 'AbortError'){
                return {success: false, msg: 'Request cancelled'};
            }
            return {success: false, msg: error.message};
        } finally{
            clearTimeout(timeoutId);
            this.abortControllers.delete(requestId);
        }
    }

    abortAllRequests(){
        for(const [id, controller] of this.abortControllers){
            controller.abort();
            this.abortControllers.delete(id);
        }
    }

    async handleErrors(errorData, originalRequest, requestInfo){
        if(errorData.code === 'GUEST_ID_MISSING'){
            const guestId = localStorage.getItem('guestId');
            const data = await this.post('/api/auth/guest', {guestId});
            if(data.success){
                if(!guestId || guestId !== data.guestId){
                    localStorage.setItem('guestId', data.guestId);
                }
                return await this.request(requestInfo.url, requestInfo.options);
            }
        }
        else if(errorData.code === 'TOKEN_EXPIRED'){
            const result = await this.handleTokenRefresh(requestInfo);
            if(result.success){
                return await this.request(requestInfo.url, requestInfo.options);
            }
            else{
                renderToast(result.msg, {toastDuration: 10000, redirect: result.redirect, success: false});
                return;
            }
        }
        return errorData;
    }

    async handleTokenRefresh(requestInfo){
        if(this.isRefreshing){
            return this.queueFailedRequest(requestInfo);
        }

        this.isRefreshing = true;

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.refreshTimeout);

            const response = await fetch('/api/auth/refresh', {
                method: 'POST', 
                credentials: 'include', 
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            const refreshed = await response.json();

            if(refreshed.success){
                this.processQueue(null);
            }
            else{
                this.processQueue(new Error(refreshed.msg));
                refreshed.redirect = '/login';
            }
            this.isRefreshing = false;
            return refreshed;

        } catch (error) {
            this.processQueue(error);
            this.isRefreshing = false;
            return {success: false, msg: 'Request timed out.'};
        }
    }

    queueFailedRequest(requestInfo){
        return new Promise((resolve, reject) => {
            this.failedQueue.push({
                resolve: () => { resolve(this.request(requestInfo.url, requestInfo.options)) },
                reject
            });
        });
    }
    processQueue(error){
        this.failedQueue.forEach(prom => {
            if(error){
                prom.reject(error);
            }
            else{
                prom.resolve();
            }
        });
        this.failedQueue = [];
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