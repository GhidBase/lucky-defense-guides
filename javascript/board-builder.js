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
      const gridCell = document.createElement("div");
    //   gridCell.classList.add("grid-overlay");
      gridCell.classList.add("board-cell");
      gridCell.id = "grid-cell-" + i;
      this.gridOverlay.append(gridCell);
    }
  }
}

const board = new Board();
board.initializeGrid();
