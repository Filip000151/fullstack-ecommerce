const toastTimers = new WeakMap();

export function renderToast(text, options = {}){
    const settings = {
        success: true,
        toastDuration: 3000,
        redirect: null,
        ...options
    };

    if(settings.redirect){
        sessionStorage.setItem('toastInfo', JSON.stringify({
            text, 
            settings: {
                success: settings.success, 
                toastDuration: settings.toastDuration
            }
        }));

        window.location.href = settings.redirect;
        return;
    }

    showToast(text, settings);
}

function showToast(text, settings){
    const toastContainer = getToasttoastContainer();

    const toasts = toastContainer.children;

    if(toasts.length >= 5){
        removeToast(toasts[0]);
    }

    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.classList.add(settings.success ? 'toast-success' : 'toast-error');
    toast.textContent = text;

    const toastTimer = document.createElement('div');
    toastTimer.classList.add('toast-duration');
    toastTimer.style.width = '100%';
    toast.appendChild(toastTimer);

    toastContainer.appendChild(toast);

    const width = toast.offsetWidth;

    toast.animate([
        {transform: `translateX(${width}px)`},
        {transform: 'translateX(0)'}
    ], {
        duration: 100,
        easing: 'ease-in'
    });

    toast.addEventListener('click', () => {
        removeToast(toast);
    });

    
    const startTime = Date.now();
    const duration = settings.toastDuration;
    let remaining = duration;

    const intervalId = setInterval(() => {
        const elapsed = Date.now() - startTime;
        remaining = Math.max(0, duration - elapsed);
        const percentage = (remaining / duration) * 100;
        toastTimer.style.width = percentage + '%';
    }, 20);

    const timeoutId = setTimeout(() => {
        removeToast(toast);
    }, settings.toastDuration);

    toastTimers.set(toast, {intervalId, timeoutId});
}

export function showPendingToast(){
    document.addEventListener('DOMContentLoaded', () => {
        const toastInfo = JSON.parse(sessionStorage.getItem('toastInfo'));
        if(!toastInfo) return;

        const settings = toastInfo.settings;
        const text = toastInfo.text;

        sessionStorage.removeItem('toastInfo');

        showToast(text, settings);
    });
}

async function removeToast(toast){
    const {intervalId, timeoutId} = toastTimers.get(toast);
    clearTimeout(timeoutId);
    clearInterval(intervalId);

    const width = toast.offsetWidth;
    const slideOutAnimation = toast.animate([
        {transform: 'translateX(0)'},
        {transform: `translateX(${width}px)`}
    ], {
        duration: 100,
        easing: 'ease-out'
    });

    await slideOutAnimation.finished;

    const toastContainer = getToasttoastContainer();
    toastContainer.removeChild(toast);
}

function getToasttoastContainer(){
    let toastContainer = document.querySelector('.toast-container');
    if(!toastContainer){
        toastContainer = document.createElement('div');
        toastContainer.classList.add('toast-container');
        document.body.appendChild(toastContainer);
    }
    return toastContainer;
}

export default renderToast;