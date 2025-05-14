import { createEmptyBoard } from "./gameData";
import { Tile } from "./Tile";

export class Game {
  private board: number[][];
  private size: number;

  constructor(size = 4) {
    this.size = size;
    this.board = createEmptyBoard(size);
  }

  // ✅ 初始化遊戲
  initilize() {
    this.board = createEmptyBoard(this.size);
    this.spawnTile();
    this.spawnTile();
    this.render();
    this.addEventListeners();
  }

  // ✅ 隨機新增一個 Tile
  spawnTile() {
    const emptyCells = this.getEmptyCells();
    if (emptyCells.length > 0) {
      const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      this.board[row][col] = Math.random() < 0.9 ? 2 : 4
    }
  }

  // ✅ 獲取空格子
  getEmptyCells(): [number, number][] {
    return this.board.flatMap((row, r) =>
      row.map((value, c) => (value == 0 ? [r, c] : null))
    ).filter(cell => cell !== null) as [number, number][]
  }


  // 核心：滑動和合併
  private slideAndMerge(direction: string) {
    const original = JSON.stringify(this.board);

    // ✅ 確保方向處理（四個方向）
    if (direction === "left") {
      this.board = this.board.map(row => this.mergeRow(row));
    } else if (direction === "right") {
      this.board = this.board.map(row => this.mergeRow(row).reverse());
    } else if (direction === "up") {
      this.transpose();
      this.board = this.board.map(row => this.mergeRow(row));
      this.transpose();
    } else if (direction === "down") {
      this.transpose();
      this.board = this.board.map(row => this.mergeRow(row.reverse()).reverse());
      this.transpose();
    }


    // ✅ 只有當棋盤有變化才產生新方塊
    if (JSON.stringify(this.board) !== original) {
      console.log(1235)
      this.spawnTile();
      this.render();

    }
  }
  private transpose() {
    this.board = this.board[0].map((_, colIndex) => (
      this.board.map(row => row[colIndex])
    ))
  }

  // ✅ 合併
  // ✅ 合併邏輯（簡化 + 高效）
  private mergeRow(row: number[]): number[] {
    const filtered = row.filter(num => num !== 0);
    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        filtered.splice(i + 1, 1); // ✅ 合併後直接移除
      }
    }

    // ✅ 填充 0，確保長度固定
    return [...filtered, ...Array(this.size - filtered.length).fill(0)];
  }




// ✅ 監聽鍵盤事件（上下左右）
private addEventListeners() {
  window.addEventListener("keydown", (e) => {
    const directions = {
      ArrowLeft: "left",
      ArrowRight: "right",
      ArrowUp: "up",
      ArrowDown: "down"
    };
    if (directions[e.key]) {
      this.slideAndMerge(directions[e.key]);
    }
  });
}


  render() {
    console.log(this.board)

    const gameContainer = document.querySelector("#game")!;
    gameContainer.innerHTML = ""; // 清空畫面

    this.board.forEach(row => {
      const rowDiv = document.createElement("div");
      rowDiv.className = "row";
      row.forEach(value => {
        const tile = new Tile(value);
        rowDiv.appendChild(tile.render());
      });
      gameContainer.appendChild(rowDiv);
    });
  }



}