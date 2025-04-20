const rarityTables = document.querySelectorAll(".rarity-table");
const raritySelector = document.getElementById("rarity-selector");

raritySelector.addEventListener("change", (event) => {
  rarityTables.forEach((element) => {
    if (event.target.value == element.id) {
      element.classList.remove("hide");
    } else {
        element.classList.add("hide");
    }
  });
});
