const tabList = document.querySelectorAll(".toggle-section");
tabList.forEach((tab) => {
    const button = tab.querySelector(".toggle-button");
    const tabBody = tab.querySelector(".toggle-panel");
    button.addEventListener("click", () => {
        // If the panel is already expanded
        if (tabBody.style.maxHeight) {
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
            tabBody.classList.remove("collapsed");
            tabBody.addEventListener("transitionend", () => {
                tabBody.classList.remove("unscrollable");
            });
            if (tabBody.id == "roulette-log") {
                tabBody.style.maxHeight = "300px";
            } else {
                tabBody.style.maxHeight = tabBody.scrollHeight + "px";
            }
            button.classList.add("expanded-button");
        }
    });
});
