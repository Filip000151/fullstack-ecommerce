export function renderProductGroup(title, products){
    function createProductGroup(){
        const productGroupHTML = `
            <h3>Some product group</h3>
            <button class="prev-button">&lt;</button>
            <button class="next-button">&gt;</button>
            <div class="product-scroller">
                <div class="product-card">
                    <img src="images/seeded/coverImage-logitech_mouse.webp" alt="">
                    <p class="product-name">Logitech mouse product example</p>
                    <div class="product-price-section">
                        <p class="product-price">$49.99</p>
                        <button class="primary-button">Add to cart</button>
                    </div>
                </div>
                <div class="product-card">
                    <img src="images/seeded/coverImage-logitech_mouse.webp" alt="">
                    <p class="product-name">Logitech mouse product example</p>
                    <div class="product-price-section">
                        <p class="product-price">$49.99</p>
                        <button class="primary-button">Add to cart</button>
                    </div>
                </div>
                <div class="product-card">
                    <img src="images/seeded/coverImage-logitech_mouse.webp" alt="">
                    <p class="product-name">Logitech mouse product example</p>
                    <div class="product-price-section">
                        <p class="product-price">$49.99</p>
                        <button class="primary-button">Add to cart</button>
                    </div>
                </div>
                <div class="product-card">
                    <img src="images/seeded/coverImage-logitech_mouse.webp" alt="">
                    <p class="product-name">Logitech mouse product example</p>
                    <div class="product-price-section">
                        <p class="product-price">$49.99</p>
                        <button class="primary-button">Add to cart</button>
                    </div>
                </div>
                <div class="product-card">
                    <img src="images/seeded/coverImage-logitech_mouse.webp" alt="">
                    <p class="product-name">Logitech mouse product example</p>
                    <div class="product-price-section">
                        <p class="product-price">$49.99</p>
                        <button class="primary-button">Add to cart</button>
                    </div>
                </div>
                <div class="product-card">
                    <img src="images/seeded/coverImage-logitech_mouse.webp" alt="">
                    <p class="product-name">Logitech mouse product example</p>
                    <div class="product-price-section">
                        <p class="product-price">$49.99</p>
                        <button class="primary-button">Add to cart</button>
                    </div>
                </div>
            </div>
        `;

        const productGroup = document.createElement('section');
        productGroup.classList.add('product-group');
        productGroup.innerHTML = productGroupHTML;

        const container = document.querySelector('.container');
        container.appendChild(productGroup);
    }

    createProductGroup();

    let counter = 0;
    const visibleCards = 4;
    const productCards = document.querySelectorAll('.product-card');
    const scroller = document.querySelector('.product-scroller');
    const scrollLimit = Math.floor(productCards.length / visibleCards);

    const nextButton = document.querySelector('.next-button');
    nextButton.addEventListener('click', () => {
        if(counter < scrollLimit){
            counter++;
            scroller.style.transform = `translateX(-${counter * 100}%)`;
        }
    });

    const prevButton = document.querySelector('.prev-button');
    prevButton.addEventListener('click', () => {
        if(counter > 0){
            counter--;
            scroller.style.transform = `translateX(${counter * 100}%)`;
        }
    });
}

export default renderProductGroup;