class Board {
  constructor() {
    this.boardContainer = document.getElementById("board-container");
    this.boardImg = this.boardContainer.querySelector("#board-img");
    this.gridOverlay = this.boardContainer.querySelector("#grid-overlay");
    this.gridArray = [];
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
    console.log(this.gridArray)
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
        console.log(this.cellNumber)
    })
  }
}

const board = new Board();
board.initializeGrid();
