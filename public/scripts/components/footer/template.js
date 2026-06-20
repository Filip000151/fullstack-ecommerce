export function renderElement(){
    const footerInnerHtml = `
        <div class="footer-upper-section">
            <a href="/">
                <img class="footer-logo" src="images/logo.png" alt="">
            </a>
            <div class="footer-link-section">
                <div class="footer-link-group">
                    <h4>Navigation</h4>
                    <ul class="footer-links">
                        <li><a href="/">Home</a></li>
                        <li><a href="/products">Products</a></li>
                        <li><a href="/checkout">Checkout</a></li>
                        <li><a href="">Link</a></li>
                    </ul>
                </div>
                <div class="footer-link-group">
                    <h4>Information</h4>
                    <ul class="footer-links">
                        <li><a>About Us</a></li>
                        <li><a>Contact Us</a></li>
                        <li><a>Affiliates</a></li>
                        <li><a>Resources</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <hr>
        <div class="footer-lower-section">
            <div class="social-icons">
                <button class="social-icon">
                    <svg>
                        <use href="images/icons/sprite.svg#facebook-icon"></use>
                    </svg>
                </button>
                <button class="social-icon">
                    <svg>
                        <use href="images/icons/sprite.svg#twitter-icon"></use>
                    </svg>
                </button>
                <button class="social-icon">
                    <svg>
                        <use href="images/icons/sprite.svg#youtube-icon"></use>
                    </svg>
                </button>
                <button class="social-icon">
                    <svg>
                        <use href="images/icons/sprite.svg#tiktok-icon"></use>
                    </svg>
                </button>
            </div>
            <p>
                &copy;Copyright. All rights reserved.
            </p>
        </div>
    `;

    let footer = document.querySelector('.footer');
    if(footer){
        footer.innerHTML = footerInnerHtml;
    }
    else{
        footer = document.createElement('footer');
        footer.classList.add('footer');
        footer.innerHTML = footerInnerHtml;

        document.body.appendChild(footer);
    }
}

export default renderElement;