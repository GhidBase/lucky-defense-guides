class Board {
    constructor() {
        this.boardContainer = document.getElementById("board-container");
        this.boardImg = this.boardContainer.querySelector("#board-img");
        this.gridOverlay = this.boardContainer.querySelector("#grid-overlay");
        this.difficultySelector = document.getElementById(
            "difficulty-selector"
        );
        this.difficultySelector.addEventListener("change", (element) => {
            console.log(element);
            this.changeBoard(element.target.value);
        });
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

    changeBoard(difficulty) {
        console.log(this.boardImg.src);
        this.boardImg.src = `../pics/boards/${difficulty}.png`;
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
        this.guardianImg = document.getElementById("guardian-img");
        this.guardianList = document.querySelector(".guardian-list");

        this.guardianListArray = [];
        this.guardians = {
            common: [
                "Bandit",
                "Thrower",
                "Archer",
                "Water Elemental",
                "Barbarian",
            ],
            rare: [
                "Sandman",
                "Demon Soldier",
                "Shock Robot",
                "Paladin",
                "Ranger",
            ],
            epic: [
                "Hunter",
                "Eagle General",
                "Electro Robot",
                "Tree",
                "Wolf Warrior",
            ],
            legendary: [
                "Storm Giant",
                "Tiger Master",
                "War Machine",
                "Sheriff",
            ],
            mythic: {
                waveClear: [
                    "Lazy Taoist",
                    "Rocket Chu",
                    "Master Kun",
                    "Bat Man",
                    "Verdee",
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
                    "Monopoly Man",
                    "Indy",
                    "Kitty Mage",
                    "Coldy",
                    "Graviton",
                    "Pulse Generator",
                    "Orc Shaman",
                    "Mama",
                    "Penguin Musician",
                ],
            },
            immortal: [
                "Reaper Frog",
                "Reaper Dian",
                "Awakened Hailey",
                "Grand Mama",
            ],
        };

        this.adjustTypeVisibility();
        this.adjustGuardianOptions();
        this.selectedGuardian = "Lazy Taoist";
        this.selectedGuardianRarity = "mythic";
        this.changeGuardianImage(this.getSelectedGuardianImg());

        this.setupEventListeners();
        this.highlightSelectedGuardian();
    }

    setupEventListeners() {
        this.typeSelector.addEventListener("change", () => {
            this.adjustGuardianOptions();
        });

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
        const type = this.typeSelector.value;
        this.guardianList.innerHTML = "";

        const addGuardianToList = (element) => {
            let firstHalf;
            switch (rarity) {
                case "mythic":
                    firstHalf = "mythics/";
                    break;
                case "immortal":
                    firstHalf = "immortals/";
                    break;
                default:
                    firstHalf = "";
            }
            const button = document.createElement("button");
            const img = document.createElement("img");
            img.src = `../pics/unit/${firstHalf}${element}.png`;
            button.appendChild(img);
            this.guardianList.appendChild(button);
            this.guardianListArray.push(button);
            this.guardianListArray[this.guardianListArray.length - 1].guardian =
                element;
            button.addEventListener("click", () => {
                this.selectedGuardian = element;
                this.selectedGuardianRarity = rarity;
                this.highlightSelectedGuardian();
            });
        };

        if (rarity != "mythic") {
            this.guardians[rarity].forEach((element) => {
                addGuardianToList(element);
            });
        } else if (rarity == "mythic") {
            this.guardians[rarity][type].forEach((element) => {
                addGuardianToList(element);
            });
        }

        this.changeGuardianImage(this.getSelectedGuardianImg());
        this.highlightSelectedGuardian();
    }

    changeGuardianImage(newImg) {
        this.guardianImg.src = newImg;
    }

    getSelectedGuardian() {
        return this.selectedGuardian;
    }

    getSelectedGuardianImg() {
        let firstHalf;
        switch (this.selectedGuardianRarity) {
            case "mythic":
                firstHalf = "mythics/";
                break;
            case "immortal":
                firstHalf = "immortals/";
                break;
            default:
                firstHalf = "";
        }
        // const firstHalf =
        //     this.selectedGuardianRarity == "mythic" ? "mythics/" : "";
        const currentGuardian = this.getSelectedGuardian();
        return `../pics/unit/${firstHalf}${currentGuardian}.png`;
    }

    highlightSelectedGuardian() {
        const childNodes = this.guardianList.childNodes;
        this.guardianListArray.forEach((element) => {
            if (element.guardian == this.selectedGuardian) {
                element.classList.add("selected");
            } else {
                element.classList.remove("selected");
            }
        });
    }
}

document.getElementById("saveBoardImageBtn").addEventListener("click", () => {
    const board = document.getElementById("board-container"); // change this ID if needed

    html2canvas(board, {
        backgroundColor: null, // ← preserves transparency
    }).then((canvas) => {
        const link = document.createElement("a");
        link.download = "my_board.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
});

const board = new Board();
