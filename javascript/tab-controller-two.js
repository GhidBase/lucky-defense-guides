const tabList = document.querySelectorAll(".toggle-section");
tabList.forEach((tab) => {
    const button = tab.querySelector(".toggle-button");
    const tabBody = tab.querySelector(".toggle-panel");
    button.addEventListener("click", () => {
        // If the panel is already expanded
        if (tabBody.style.maxHeight) {
            tabBody.style.maxHeight = null;
            tabBody.style.paddingTop = 0;
            tabBody.style.paddingBottom = 0;
            tabBody.addEventListener(
                "transitionend",
                () => {
                    if (!tabBody.style.maxHeight) {
                      tabBody.classList.add("collapsed");
                      button.classList.remove("expanded-button");
                    }
                },
                { once: true }
            );
        } else {
            // If the panel is collapsed
            tabBody.style.paddingTop = null;
            tabBody.style.paddingBottom = null;
            if (tabBody.id == "roulette-log") {
                tabBody.style.maxHeight = "300px";
            } else {
                tabBody.style.maxHeight = tabBody.scrollHeight + "px";
            }
            tabBody.classList.remove("collapsed");
            button.classList.add("expanded-button");
        }
    });
});
