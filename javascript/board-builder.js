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
    this.guardianImg = document.getElementById("guardian-img");
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

    this.adjustTypeVisibility();
    this.adjustGuardianOptions();
  }

  setupEventListeners() {
    this.typeSelector.addEventListener("change", () => {
      this.adjustGuardianOptions();
    })

    this.raritySelector.addEventListener("change", () => {
      this.adjustTypeVisibility();
      this.adjustGuardianOptions();
    });

    this.guardianSelector.addEventListener("change", () => {
      this.changeGuardianImage(this.guardianSelector.value)
    })
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
    const type = this.typeSelector.value;
    if (rarity != "mythic") {
      this.guardianSelector.innerHTML = "";
      this.guardians[rarity].forEach((element) => {
        const option = document.createElement("option");
        option.value = element;
        option.textContent = element;
        this.guardianSelector.appendChild(option);
      });
    } else if (rarity == "mythic") {this.guardianSelector.innerHTML = "";
      this.guardians[rarity][type].forEach((element) => {
        const option = document.createElement("option");
        option.value = element;
        option.textContent = element;
        this.guardianSelector.appendChild(option);
      });
    }


    this.changeGuardianImage(this.guardianSelector.value);
  }

  changeGuardianImage(newImg) {
    console.log(newImg)
    this.guardianImg.src = `../pics/unit/mythics/${newImg}.png`;
  }
}

const board = new Board();
const selectorModal = new GuardianSelector();