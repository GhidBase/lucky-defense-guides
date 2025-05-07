const modal = document.getElementById("donationModal");
const openButtons = document.querySelectorAll(".openModalBtn");
const closeButton = document.querySelector(".close");

openButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    modal.style.display = "block";
  });
});

closeButton.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
});
