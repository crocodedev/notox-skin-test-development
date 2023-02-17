class Review {
    selectors = {
        jsContainer: '.reviews__js-container',
        spr: {
            jsonSchema: 'script',
            form: 'spr-form',
            reviews: 'spr-reviews',
            review: '.spr-review',
            iconStar: '.spr-icon-star',
            author: '.spr-review-header-byline strong:first-child',
            date: '.spr-review-header-byline strong:last-child',
            content: '.spr-review-content-body'
        },
        ratingContainer: '.js-container',
        ratingFloat: '.js-rating-float',
        ratingText: '.js-rating-text',
        ratingStar: '.js-rating-star',
        ratingElement: '.js-rating-element',
        ratingElementText: '.js-rating-element-text',
        buttonForm: '.js-button-review-form',
        reviewForm: '.js-review-form',
        reviewList: '.js-review-list',
        reviewElementTemplate: '.js-review-element-template',
        reviewNoElement: '.js-review-no-element',
        reviewElement: {
            star: '.js-review-element-star',
            author: '.js-review-element-author',
            date: '.js-review-element-date',
            recommend: '.js-review-element-recommend',
            content: '.js-review-element-content'
        }
    }

    modifiers = {
        starFull: 'reviews__star--full',
        hidden: 'hidden'
    }

    generationJsonReviewStatus = false;
    reviewCount = 0;
    reviews = []

    constructor(container) {
        if (!container) return false;

        this.container = container;

        this.init();
    }

    init() {
        this.jsContainer = this.container.querySelector(this.selectors.jsContainer);

        this.jsonSchema = JSON.parse(this.jsContainer.querySelector(this.selectors.spr.jsonSchema).innerHTML);
        this.reviewCount = parseInt(this.jsonSchema.reviewCount);
        this.reviewRating = parseFloat(this.jsonSchema.ratingValue);

        this.buttonForm = this.container.querySelector(this.selectors.buttonForm);
        this.reviewForm = this.container.querySelector(this.selectors.reviewForm);
        this.reviewList = this.container.querySelector(this.selectors.reviewList);
        this.reviewElementTemplate = this.container.querySelector(this.selectors.reviewElementTemplate);

        const config = {childList: true, subtree: true};
        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.type === 'childList') {

                    if (mutation.target.classList.contains(this.selectors.spr.form)) {
                        this.generationForm(mutation.target);
                    }

                    if (mutation.target.classList.contains(this.selectors.spr.reviews)) {
                        let reviews = this.container.querySelectorAll(this.selectors.spr.review);

                        this.reviews = [];
                        this.generationJsonReview(reviews);

                        this.generationContainer();
                        this.generationReviews();
                    }
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(this.jsContainer, config);

        this.container.addEventListener('click', (event) => {
            let element = event.target.closest('[data-type="btn-show"]');

            if (element) {
                this.generationReviews(true);
            }
        });
    }

    generationForm(formContainer) {
        if (!this.reviewForm || !this.buttonForm) return false;

        let newForm = formContainer.cloneNode(true);
        formContainer.remove();
        newForm.style.display = '';

        this.reviewForm.appendChild(newForm);

        this.buttonForm.addEventListener('click', (event) => {
            event.preventDefault();
            this.reviewForm.classList.toggle(this.modifiers.hidden);
        });
    }

    generationJsonReview(reviews) {
        reviews.forEach(review => {

            let id = review.id;
            let countStar = review.querySelectorAll(this.selectors.spr.iconStar).length;
            let author = review.querySelector(this.selectors.spr.author).innerHTML;
            let date = review.querySelector(this.selectors.spr.date).innerHTML;
            let content = review.querySelector(this.selectors.spr.content).innerHTML;

            this.reviews.push({
                id: id,
                countStar: countStar,
                author: author,
                date: date,
                content: content
            });
        });
    }

    generationContainer() {
        this.ratingContainer = this.container.querySelector(this.selectors.ratingContainer);
        this.ratingFloat = this.ratingContainer.querySelector(this.selectors.ratingFloat);
        this.ratingText = this.ratingContainer.querySelector(this.selectors.ratingText);
        this.ratingStars = this.ratingContainer.querySelectorAll(this.selectors.ratingStar);
        this.ratingElements = this.ratingContainer.querySelectorAll(this.selectors.ratingElement);

        if (this.ratingFloat) this.ratingFloat.innerHTML = this.reviewRating.toFixed(1);
        if (this.ratingText) this.ratingText.innerHTML = this.ratingText.innerHTML.replace('0', this.reviewCount);
        4

        this.ratingStars.forEach((star, starIndex) => {
            if (starIndex + 1 <= this.reviewRating) {
                star.classList.add(this.modifiers.starFull);
            }
        });

        this.ratingElements.forEach(element => {
            const elementText = element.querySelector(this.selectors.ratingElementText);
            const starNumber = parseInt(element.dataset.star);

            let starRatingCount = 0;
            this.reviews.forEach(review => {
                if (review.countStar === starNumber) {
                    starRatingCount++;
                }
            });

            if (starRatingCount) {
                let StarRatingPercent = `${starRatingCount / this.reviewCount * 100}%`
                element.style.setProperty('--rating', StarRatingPercent);
                elementText.innerHTML = StarRatingPercent;
            }
        });
    }

    generationReviews(fullWidth = false) {
        if (!this.reviewElementTemplate || !this.reviewList) return false;

        if (this.reviews.length !== 0) {
            this.reviewList.innerHTML = '';
        }

        let reviews = this.reviews;
        if (!fullWidth) {
            reviews = this.reviews.slice(0, 4);
        }

        reviews.forEach(review => {
            let reviewItem = this.reviewElementTemplate.cloneNode(true);
            reviewItem.classList.remove(this.modifiers.hidden);
            reviewItem.querySelectorAll(this.selectors.reviewElement.star).forEach((star, starIndex) => {
                if (starIndex + 1 <= review.countStar) {
                    star.classList.add(this.modifiers.starFull);
                }
            });
            reviewItem.querySelector(this.selectors.reviewElement.author).innerHTML = review.author;
            reviewItem.querySelector(this.selectors.reviewElement.date).innerHTML = review.date;
            if (review.countStar >= 4) {
                reviewItem.querySelector(this.selectors.reviewElement.recommend).classList.remove(this.modifiers.hidden);
            } else {
                reviewItem.querySelector(this.selectors.reviewElement.recommend).classList.add(this.modifiers.hidden);
            }
            reviewItem.querySelector(this.selectors.reviewElement.content).innerHTML = review.content;

            this.reviewList.appendChild(reviewItem);
        });

        if (!fullWidth) {
            let button = document.createElement("button");
            button.innerHTML = 'Show more';
            button.dataset.type = 'btn-show';
            button.classList.add('reviews__btn');

            this.reviewList.appendChild(button);
        }
    }
}

document.querySelectorAll(`[data-section-type="reviews"]`).forEach(section => {
    if (!section.classList.contains['reviews-js-active']) {
        new Review(section);
        section.classList.add('reviews-js-active');
    }
});