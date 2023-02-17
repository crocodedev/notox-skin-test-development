class BeforeAfterSlider {
    constructor() {
        this.selectors = {
            sliderContainer: ".before-after-slider__slides",
            paginationElement: ".before-after-slider__pagination"
        }

        this.classes = {
            activeSlide: "before-after-slider__slide--active"
        }

        this.initSlider();
    }

    initSlider() {
        const swiperOptions = {
            loop: true,
            slidesPerView: "auto",
            spaceBetween: 0,
            slideNextClass: this.classes.activeSlide,
            initialSlide: 2,
            on: {
                init: function(swiper) {
                    const autoPlayEnable = swiper.el.dataset.autoplay;
                    console.log(swiper);
                    if (autoPlayEnable && autoPlayEnable === "true") {
                      const autoPlayDelay = +swiper.el.dataset.autoplayDelay;
              
                      if (autoPlayDelay) {
                        swiper.params.autoplay.delay = autoPlayDelay * 1000;
                        swiper.autoplay.start();
                      } else {
                        swiper.autoplay.start();
                      }
                    }
                },
            },
            pagination: {
                el: this.selectors.paginationElement,
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

        const swiper = new Swiper(this.selectors.sliderContainer, swiperOptions);
    }
}

document.querySelectorAll(`[data-section-type="before-after-slider"]`).forEach(section => {
    if (!section.classList.contains['before-after-slider-js-active']) {
        new BeforeAfterSlider(section);
        section.classList.add('before-after-slider-js-active');
    }
});
