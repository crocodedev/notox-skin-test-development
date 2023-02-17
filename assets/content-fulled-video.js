class ContentFulledVideo {
    constructor(container) {
        this.selectors = {
            tabLabel: ".js-content-fulled-video-label",
            tabInput: ".js-content-fulled-video-input",
            activeLabel: ".content-fulled-video__tabs-label.content-fulled-video__tabs-label--active",
            buttonPlay: ".js-content-fulled-video-button-play",
            videoContainer: ".js-content-fulled-video-container",
            template: ".js-content-fulled-video-template",
            videoContent: ".js-video-youtube, .js-video-vimeo",
            bottomContainer: ".js-content-fulled-video-bottom-container"
        }   
        
        this.classes = {
            activeTab: "content-fulled-video__tabs-label--active",
            hidden: "hidden",
            videoWrapper: "content-fulled-video__image-wrap"
        }

        this.container = container;

        this.init();
    }

    init() {
        this.tabChange();
        this.initVideo();
        this.initBottomSectionVariants();
    }

    tabChange() {
        const inputList = this.container.querySelectorAll(this.selectors.tabInput);

		if (!inputList || inputList.length === 0) {
			return;
		}

		const firstInput = inputList[0];
		const firstLabel = this.container.querySelector(`[for=${firstInput.id}]`);

		firstInput.checked = true;
		firstLabel.classList.add(this.classes.activeTab);

		inputList.forEach((input) => {
            const currentLabel = this.container.querySelector(`[for=${input.id}]`);

			input.addEventListener("change", () => {
				let activeItem = this.container.querySelector(this.selectors.activeLabel);

				if (activeItem) activeItem.classList.remove(this.classes.activeTab);

				if (input.checked)
                currentLabel.classList.add(this.classes.activeTab);
			});
		});
    }

    initVideo() {
        const buttonPlay = this.container.querySelector(this.selectors.buttonPlay);

		if (buttonPlay.classList.contains(this.classes.hidden)) {
			buttonPlay.classList.remove(this.classes.hidden);
		}

		buttonPlay.addEventListener("click", () => {
			const content = document.createElement("div");
			const videoContainer = this.container.querySelector(
				this.selectors.videoContainer
			);
			const template = videoContainer.querySelector(this.selectors.template);

			content.appendChild(
				template.content.firstElementChild.cloneNode(true)
			);

            

			if (content.querySelector(this.selectors.videoContent)) {
				const video = content.querySelector(this.selectors.videoContent);
                const videoWrapper = document.createElement("div");
                videoWrapper.appendChild(video);

                if (!videoWrapper.classList.contains(this.classes.videoWrapper)) {
                    videoWrapper.classList.add(this.classes.videoWrapper);
                }

				videoContainer.appendChild(videoWrapper);

				if (!buttonPlay.classList.contains(this.classes.hidden)) {
					buttonPlay.classList.add(this.classes.hidden);
				}
			}
		});
    }

    initBottomSectionVariants() {
        document.addEventListener("variant:isbox", (event) => {
            const bottomVariants = this.container.querySelector(this.selectors.bottomContainer);
            const incommingId = +event.detail;
            const currentId = +this.container.dataset.isBoxVariantId;
            const isBox = incommingId === currentId;
            
            if (bottomVariants) {
                if (isBox && isBox === true) {
                    bottomVariants.classList.add(this.classes.hidden);
                } else {
                    bottomVariants.classList.remove(this.classes.hidden);
                }
            }
        });
    }
}

document.querySelectorAll(`[data-section-type="content-fulled-video"]`).forEach(section => {
    if (!section.classList.contains['content-fulled-video-js-active']) {
        new ContentFulledVideo(section);
        section.classList.add('content-fulled-video-js-active');
    }
});