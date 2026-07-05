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

export default createElement;