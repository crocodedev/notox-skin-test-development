class BeforeAfterSlider {
    constructor() {
        this.initSlider();
    }

    initSlider() {
        const swiperOptions = {
            loop: true,
            slidesPerView: "auto",
            spaceBetween: 0,
            slideNextClass: "before-after-slider__slide--active",
            pagination: {
                el: ".before-after-slider__pagination",
                bulletClass: "before-after-slider__pagination-item",
                bulletActiveClass: "before-after-slider__pagination-item--active",

                renderBullet: function () {
                return `
                    <span class="before-after-slider__pagination-item">
                        <span class="before-after-slider__pagination-item-fill"></span>
                    </span>`;
                },
                clickable: true,
            }
        };

        const swiper = new Swiper(".before-after-slider__slides", swiperOptions);
    }
}

document.querySelectorAll(`[data-section-type="before-after-slider"]`).forEach(section => {
    if (!section.classList.contains['before-after-slider-js-active']) {
        new BeforeAfterSlider(section);
        section.classList.add('before-after-slider-js-active');
    }
});
