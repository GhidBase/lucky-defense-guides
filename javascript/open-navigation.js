const navButton = document.querySelector(".menu");
const navMenu = document.querySelector(".side-bar");
const cover = document.querySelector(".cover");

navButton.addEventListener("click", () => {
    console.log("hi");
    navMenu.classList.toggle("visible");
    cover.classList.toggle("visible");
})

cover.addEventListener("click", () => {
    navMenu.classList.toggle("visible");
    cover.classList.toggle("visible");
})