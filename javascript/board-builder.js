class Board {
  constructor() {
    this.boardContainer = document.getElementById("board-container");
    this.boardImg = this.boardContainer.querySelector("#board-img");
    this.gridOverlay = this.boardContainer.querySelector("#grid-overlay");
    this.gridArray = [];
    this.initializeGrid();
  }

  initializeGrid() {
    this.gridOverlay.innerText = "";
    this.gridArray = [];

    for (let i = 0; i < 18; i++) {
      const gridElement = document.createElement("div");
      gridElement.classList.add("board-cell");
      gridElement.id = "grid-cell-" + i;
      this.gridOverlay.append(gridElement);
      const gridObject = new Cell(gridElement, i);
      this.gridArray.push(gridObject);
    }
    console.log(this.gridArray);
  }
}

class Cell {
  constructor(element, cellNumber) {
    this.guardian;
    this.guardianCount = 1;
    this.element = element;
    this.cellNumber = cellNumber;
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.element.addEventListener("click", () => {
      console.log(this.cellNumber);
    });
  }
}

class GuardianSelector {
  constructor() {
    this.modal = document.getElementById("guardian-selector-modal");
    this.raritySelector = document.getElementById("rarity-selector");
    this.typeSelector = document.getElementById("type-selector");
    this.guardianSelector = document.getElementById("guardian-selector");
    this.selectGuardianButton = document.getElementById(
      "select-guardian-button"
    );
    this.setupEventListeners();

    this.guardians = {
      common: ["Bandit", "Thrower", "Archer", "Water Elemental", "Barbarian"],
      rare: ["Sandman", "Demon Soldier", "Shock Robot", "Paladin", "Ranger"],
      epic: [
        "Hunter",
        "Eagle General",
        "Electro Robot",
        "Tree",
        "Wolf Warrior",
      ],
      legendary: ["Storm Giant", "Tiger Master", "War Machine", "Sheriff"],
      mythic: {
        waveClear: [
          "Lazy Taoist",
          "Rocket Chu",
          "Master Kun",
          "Bat Man",
          "Iron Meow",
          "Dragon",
          "Tar",
          "Frog Prince",
          "Bomba",
          "Blob",
          "Ninja",
        ],
        bossKillers: ["Lancelot", "Vayne", "Watt", "Zap"],
        support: [
          "Graviton",
          "Indy",
          "Kitty Mage",
          "Coldy",
          "Pulse Generator",
          "Orc Shaman",
          "Monopoly Man",
          "Mama",
        ],
      },
    };
  }

  setupEventListeners() {

    this.raritySelector.addEventListener("change", () => {
      this.adjustTypeVisibility();
      this.adjustGuardianOptions();
    });
  }

  adjustTypeVisibility() {
    if (this.raritySelector.value == "mythic") {
      this.typeSelector.parentElement.classList.remove("hidden");
    } else {
      this.typeSelector.parentElement.classList.add("hidden");
    }
  }

  adjustGuardianOptions() {
    const rarity = this.raritySelector.value;
    if (rarity != "mythic") {
      // set guardianSelect.innerHtml = "";
      this.guardianSelector.innerHTML = "";
      // create the elements
      this.guardians[rarity].forEach((element) => {
        console.log(element);
      });
    }
  }
  /* 
    When a Rarity is selected, if it's not mythic, set the
    options in the guardian selector to the array for that rarity

    If it is mythic, base those options off of whichever type of
    mythic is selected in the type selector

    createElement option
    option.value
    option.textContent
    appendChild
  */
}

const board = new Board();
const selectorModal = new GuardianSelector();
selectorModal.adjustTypeVisibility();
