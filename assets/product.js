class Product {
    selectors = {
        variants: '.js-product-variants',
        json: '.js-product-json',
        image: '.js-product-image',
        price: {
            container: '.js-product-price',
            current: '.js-product-price-current',
            sale: '.js-product-price-sale'
        },
        quantity: {
            container: '.js-quantity-container',
            button: '.js-quantity-button',
            input: '.js-quantity-input'
        },
        button: {
            buy: '.js-button-buy',
            buyText: '.js-button-buy-text'
        }
    }

    modifiers = {
        soldOut: 'product__price--sold-out',
        onSale: 'product__price--on-sale',
        container: 'product--container',
        containerRight: 'product--container-right'
    }

    constructor(container) {
        if (!container) return false;

        this.container = container;

        this.init();
    }

    init() {
        this.productJson = JSON.parse(this.container.querySelector(this.selectors.json).innerHTML);
        this.variantsList = this.container.querySelector(this.selectors.variants);

        this.productImage = this.container.querySelector(this.selectors.image);

        this.priceContainer = this.container.querySelector(this.selectors.price.container);
        this.priceCurrent = this.priceContainer.querySelector(this.selectors.price.current);
        this.priceSale = this.priceContainer.querySelector(this.selectors.price.sale);

        this.quantityContainer = this.container.querySelector(this.selectors.quantity.container);
        this.quantityInput = this.quantityContainer.querySelector(this.selectors.quantity.input);

        this.buttonBuy = this.container.querySelector(this.selectors.button.buy);
        this.buttonBuyText = this.buttonBuy.querySelector(this.selectors.button.buyText);

        if (this.variantsList) {
            this.variantsList.addEventListener('change', (event) => {
                let element = event.target.closest('[name="id"]');

                this.changeVariant(element.value);
            });
        }

        this.updateQuantityButton();
    }

    changeVariant(variantId) {
        this.activeVariantId = variantId*1;
        this.activeVariant = this.productJson.find(variant => variant.id == this.activeVariantId);

        this.changeUrl();
        this.changeMedia();
        this.changePrice();
        this.changeQuantity();
        this.changeButtonBuy();
        this.updateQuantityInput();
    }

    changeUrl() {
        window.history.replaceState({ }, '', `${this.container.dataset.url}?variant=${this.activeVariantId}`);
    }

    changeMedia() {
        if (this.activeVariant.color.main !== '') {
            this.container.style.setProperty('--color-main', this.activeVariant.color.main);
            this.container.style.setProperty('--color-main-2', `${this.activeVariant.color.main}80`);
        } else {
            this.container.style.setProperty('--color-main', '#FFFFFF');
            this.container.style.setProperty('--color-main-2', `#FFFFFF80`);
        }

        if (this.activeVariant.image.width > this.activeVariant.image.height) {
            this.container.classList.remove(this.modifiers.container);
            this.container.classList.add(this.modifiers.containerRight);
        } else {
            this.container.classList.add(this.modifiers.container);
            this.container.classList.remove(this.modifiers.containerRight);
        }

        if (this.productImage) {
            this.productImage.querySelector('img').src = this.activeVariant.image.src;
        }
    }

    changePrice() {
        if (!this.priceContainer) return false;

        if (this.activeVariant.price && this.priceCurrent) {
            this.priceCurrent.innerHTML = this.activeVariant.price;
        }

        if (this.activeVariant.compareAtPrice && this.priceSale) {
            this.priceSale.innerHTML = this.activeVariant.compareAtPrice;
            this.priceContainer.classList.add(this.modifiers.onSale);
        } else if (!this.activeVariant.compareAtPrice && this.priceSale) {
            this.priceSale.innerHTML = '';
            this.priceContainer.classList.remove(this.modifiers.onSale);
        }
    }

    changeQuantity() {
        if (!this.quantityInput) return false;

        if (this.activeVariant.quantityRule.min) {
            this.quantityInput.dataset.min = this.quantityInput.min = this.activeVariant.quantityRule.min;
        } else {
            this.quantityInput.dataset.min = this.quantityInput.min = '';
        }

        if (this.activeVariant.quantityRule.max) {
            this.quantityInput.dataset.max = this.quantityInput.max = this.activeVariant.quantityRule.max;
        } else {
            this.quantityInput.dataset.max = this.quantityInput.max = '';
        }

        if (this.activeVariant.quantityRule.increment) {
            this.quantityInput.step = this.activeVariant.quantityRule.increment;
        } else {
            this.quantityInput.step = '';
        }
    }

    changeButtonBuy() {
        if (!this.buttonBuy) return false;

        if (this.activeVariant.available === false || this.activeVariant.quantityRuleSoldout === true) {
            this.buttonBuy.disabled = true;
            this.buttonBuyText.innerHTML = this.buttonBuyText.dataset.sold;
        }
        else {
            this.buttonBuy.disabled = false;
            this.buttonBuyText.innerHTML = this.buttonBuyText.dataset.add;
        }
    }

    updateQuantityInput(newValue = null) {
        if (!newValue) newValue = this.quantityInput.value*1;

        if (this.quantityInput.min && this.quantityInput.min*1 > newValue) {
            this.quantityInput.value = this.quantityInput.min
        } else if (this.quantityInput.max && this.quantityInput.max*1 < newValue) {
            this.quantityInput.value = this.quantityInput.max
        } else {
            this.quantityInput.value = newValue;
        }
    }

    updateQuantityButton() {
        if (!this.quantityInput) return false;

        this.quantityContainer.addEventListener('click', (event) => {
            let elementButton = event.target.closest(this.selectors.quantity.button);
            if (elementButton) {
                event.preventDefault();

                let newValue = this.quantityInput.value*1 + ((elementButton.value === '+') ? 1 : -1)

                this.updateQuantityInput(newValue);
            }
        });

        this.quantityInput.addEventListener('input', (event) => {
                this.updateQuantityInput();
        });
    }
}

document.querySelectorAll(`[data-section-type="product"]`).forEach(section => {
    if (!section.classList.contains['product-active']) {
        new Product(section);
        section.classList.add('product-active');
    }
});