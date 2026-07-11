import apiClient from "./apiClient.js";
import renderToast from '../utils/toast.js';

export const auth = {
    isGuest: true,
    currentUser: null,
};

export async function loadCurrentUser(){
    const data = await apiClient.get('/api/auth');

    if(data.success){
        if(data.isGuest){
            auth.isGuest = true;
            auth.currentUser = null;
        }
        else{
            auth.isGuest = false;
            auth.currentUser = data.user;
        }
    }
    else{
        renderToast(data.msg, {success: false, redirect: '/'});
    }

    return data;
}

export async function registerUser(body = {}, redirect = {}){
    const data = await apiClient.post('/api/auth/register', {...body});

    if(data.success){
        renderToast(data.msg, {
            toastDuration: 5000, 
            redirect: redirect.redirect
        });
    }
    else{
        renderToast(data.msg, {toastDuration: 10000, success: false});
    }

    return data;
}

export async function loginUser(body = {}, redirect = {}){
    const data = await apiClient.post('/api/auth/login', {...body});

    if(data.success){
        renderToast(data.msg, {
            toastDuration: 5000, 
            redirect: redirect.redirect
        });
    }
    else{
        renderToast(data.msg, {toastDuration: 10000, success: false});
    }

    return data;
}

export async function logoutUser(redirect = {}){
    const data = await apiClient.post('/api/auth/logout');

    if(data.success){
        renderToast(data.msg, {toastDuration: 5000, redirect: redirect.redirect});
    }

    return data;
}



export default auth;