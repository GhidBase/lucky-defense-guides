let inputField = document.querySelector("#scroll-input");
let useScrollsButton = document.querySelector("#use-scrolls-button");

useScrollsButton.addEventListener("click",performRecruit)

function performRecruit() {
    let singlePulls = Math.trunc(inputField.value / 30);

    inputField.value = singlePulls;
}