const tabList = document.querySelectorAll(".toggle-section");
tabList.forEach((tab) => {
    const button = tab.querySelector(".toggle-button");
    const tabBody = tab.querySelector(".toggle-panel");
    button.addEventListener("click", () => {
        // If the panel is already expanded
        if (
            tabBody.style.maxHeight ||
            tabBody.classList.contains("expand-details")
        ) {
            if (tabBody.id == "details-panel") {
                tabBody.classList.remove("expand-details");
            }
            tabBody.style.maxHeight = null;
            tabBody.classList.add("unscrollable");
            tabBody.addEventListener(
                "transitionend",
                () => {
                    if (!tabBody.style.maxHeight) {
                        tabBody.classList.add("unscrollable");
                        tabBody.classList.add("collapsed");
                        button.classList.remove("expanded-button");
                    }
                },
                { once: true }
            );
        } else {
            // If the panel is collapsed
            tabBody.classList.add("unscrollable");
            tabBody.addEventListener("transitionend", () => {
                tabBody.classList.remove("unscrollable");
            });
            if (tabBody.id == "roulette-log") {
                tabBody.style.maxHeight = "300px";
            } else if (tabBody.id == "details-panel") {
                const isSmallScreen = window.matchMedia(
                    "(max-width: 1000px)"
                ).matches;
                if (isSmallScreen) {
                    tabBody.classList.add("expand-details");
                } else {
                    tabBody.style.maxHeight = tabBody.scrollHeight + "px";
                }
            } else {
                tabBody.style.maxHeight = tabBody.scrollHeight + "px";
            }
            tabBody.classList.remove("collapsed");
            button.classList.add("expanded-button");
        }
    });
});
