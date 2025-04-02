const navButton = document.querySelector(".menu");
const navMenu = document.querySelector(".side-bar");
const cover = document.querySelector(".cover");
const body = document.querySelector("body");

navButton.addEventListener("click", () => {
    console.log("hi");
    navMenu.classList.toggle("visible");
    cover.classList.toggle("visible");
    body.classList.toggle("unscrollable");
})

cover.addEventListener("click", () => {
    navMenu.classList.toggle("visible");
    cover.classList.toggle("visible");
    body.classList.toggle("unscrollable");
})