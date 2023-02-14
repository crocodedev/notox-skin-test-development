class ContentFulledVideo {
    constructor(container) {
        this.selectors = {
            tabLabel: ".js-content-fulled-video-label",
            tabInput: ".js-content-fulled-video-input",
            activeLabel: ".content-fulled-video__tabs-label.content-fulled-video__tabs-label--active"
        }   
        
        this.classes = {
            activeTab: "content-fulled-video__tabs-label--active"
        }

        this.container = container;

        this.init();
    }

    init() {
        this.tabChange();
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
			input.addEventListener("change", () => {
				let activeItem = this.container.querySelector(this.selectors.activeLabel);

				if (activeItem) activeItem.classList.remove(this.classes.activeTab);

				if (input.checked)
                this.container
						.querySelector(`[for=${input.id}]`)
						.classList.add(this.classes.activeTab);
			});
		});
    }
}

document.querySelectorAll(`[data-section-type="content-fulled-video"]`).forEach(section => {
    if (!section.classList.contains['content-fulled-video-js-active']) {
        new ContentFulledVideo(section);
        section.classList.add('content-fulled-video-js-active');
    }
});