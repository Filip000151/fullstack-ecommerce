export function renderFooter(){
    createFooter();

    function createFooter(){
        const footerInnerHtml = `
            <div class="footer-upper-section">
                <img class="footer-logo" src="images/logo.png" alt="">
                <div class="footer-link-section">
                    <div class="footer-link-group">
                        <h4>Navigation</h4>
                        <ul class="footer-links">
                            <li><span>Link</span></li>
                            <li><span>Link</span></li>
                            <li><span>Link</span></li>
                            <li><span>Link</span></li>
                        </ul>
                    </div>
                    <div class="footer-link-group">
                        <h4>Information</h4>
                        <ul class="footer-links">
                            <li><span>About Us</span></li>
                            <li><span>Contact Us</span></li>
                            <li><span>Affiliates</span></li>
                            <li><span>Resources</span></li>
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
}

export default renderFooter;