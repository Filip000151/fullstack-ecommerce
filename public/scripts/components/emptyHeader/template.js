export function createElement(){
    const html = `
        <a href="/">
            <img src="images/logo.png">
        </a>
    `;
    let emptyHeader = document.querySelector('.empty-header');
    if(emptyHeader){
        emptyHeader.innerHTML = html;
    }
    else{
        emptyHeader = document.createElement('header');
        emptyHeader.classList.add('empty-header');
        emptyHeader.innerHTML = html;
        document.body.appendChild(emptyHeader);
    }
}

export function renderEmptyHeaderSkeleton(){
    const emptyHeaderSkeleton = document.createElement('header');
    emptyHeaderSkeleton.classList.add('empty-header');
    const html = `
        <div class="skeleton" style="width: 180px; height: 50px;"></div>
    `;
    emptyHeaderSkeleton.innerHTML = html;
    document.body.appendChild(emptyHeaderSkeleton);
    return emptyHeaderSkeleton;
}

export default createElement;