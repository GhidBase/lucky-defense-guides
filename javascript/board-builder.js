class Board {
  constructor() {
    this.boardContainer = document.getElementById("board-container");
    this.boardImg = this.boardContainer.querySelector("#board-img");
    this.gridOverlay = this.boardContainer.querySelector("#grid-overlay");
    this.gridArray = [];
    this.guardianSelector = new GuardianSelector();
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
      const gridObject = new Cell(gridElement, i, this.guardianSelector);
      this.gridArray.push(gridObject);
    }
  }
}

class Cell {
  constructor(element, cellNumber, guardianSelector) {
    this.guardian;
    this.guardianCount = 1;
    this.element = element;
    this.cellNumber = cellNumber;
    this.setupEventListeners();
    this.guardianSelector = guardianSelector;
    this.imgElement = document.createElement("img");
    this.element.appendChild(this.imgElement);
    this.imgSrc;
  }

  setupEventListeners() {
    this.element.addEventListener("click", () => {
      this.setImage();
    });
  }

  setImage() {
    const selectedImgSrc = this.guardianSelector.getSelectedGuardianImg();
    if (selectedImgSrc != this.imgSrc) {
      this.imgSrc = selectedImgSrc;
      this.imgElement.src = selectedImgSrc;
    } else {
      this.imgElement.src = "";
      this.imgSrc = "";
    }

    // Force repaint
    this.element.style.display = "none";
    this.element.offsetHeight; // Trigger reflow
    this.element.style.display = "";
  }
}

class GuardianSelector {
  constructor() {
    this.modal = document.getElementById("guardian-selector-modal");
    this.raritySelector = document.getElementById("rarity-selector");
    this.typeSelector = document.getElementById("type-selector");
    this.guardianSelector = document.getElementById("guardian-selector");
    this.guardianImg = document.getElementById("guardian-img");
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
    this.setupEventListeners();

    this.adjustTypeVisibility();
    this.adjustGuardianOptions();

    this.selectedGuardian = this.getGuardianDropDownValue();
    this.changeGuardianImage(this.getSelectedGuardianImg());
  }

  setupEventListeners() {
    this.typeSelector.addEventListener("change", () => {
      this.adjustGuardianOptions();
    });

    this.raritySelector.addEventListener("change", () => {
      this.adjustTypeVisibility();
      this.adjustGuardianOptions();
    });

    this.guardianSelector.addEventListener("change", () => {
      this.selectedGuardian = this.getGuardianDropDownValue();
      this.changeGuardianImage(this.getSelectedGuardianImg());
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
    const type = this.typeSelector.value;
    if (rarity != "mythic") {
      this.guardianSelector.innerHTML = "";
      this.guardians[rarity].forEach((element) => {
        const option = document.createElement("option");
        option.value = element;
        option.textContent = element;
        this.guardianSelector.appendChild(option);
      });
    } else if (rarity == "mythic") {
      this.guardianSelector.innerHTML = "";
      this.guardians[rarity][type].forEach((element) => {
        const option = document.createElement("option");
        option.value = element;
        option.textContent = element;
        this.guardianSelector.appendChild(option);
      });
    }

    this.changeGuardianImage(this.getSelectedGuardianImg());
  }

  changeGuardianImage(newImg) {
    this.guardianImg.src = newImg;
  }

  getGuardianDropDownValue() {
    return this.guardianSelector.value;
  }

  getSelectedGuardian() {
    return this.selectedGuardian;
  }

  getSelectedGuardianImg() {
    const firstHalf = this.raritySelector.value == "mythic" ? "mythics/" : "";
    const currentGuardian = this.getSelectedGuardian();
    return `../pics/unit/${firstHalf}${currentGuardian}.png`;
  }
}

const board = new Board();
