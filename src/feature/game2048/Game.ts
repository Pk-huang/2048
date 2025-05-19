import { createEmptyBoard } from "./gameData";
import { Tile } from "./Tile";

export class Game {
  private board: number[][];
  private size: number;

  constructor(size = 4) {
    this.size = size;
    this.board = createEmptyBoard(size);
  }

  // ✅ 初始化遊戲棋盤（4x4 固定）
  initializeBoard() {
    const gameContainer = document.querySelector("#game")!;
    gameContainer.innerHTML = ""; // 清空畫面

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const tile = document.createElement("div");
        tile.className = "tile tile-empty";
        tile.style.setProperty("--row", r.toString());
        tile.style.setProperty("--col", c.toString());
        tile.dataset.position = `${r}-${c}`;
        gameContainer.appendChild(tile);
      }
    }
  }

  // ✅ 初始化遊戲（重構）
  initialize() {
    this.board = createEmptyBoard(this.size);
    this.initializeBoard(); // ✅ 確保棋盤固定
    this.spawnTile(); // ✅ 產生兩個隨機數字方塊
    this.updateBoard(); // ✅ 渲染數字
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

  // ✅ 核心：滑動和合併
  private slideAndMerge(direction: string) {
    const original = JSON.stringify(this.board);

    if (direction === "left") {
      this.board = this.board.map(row => this.mergeRow(row));
    } else if (direction === "right") {
      this.board = this.board.map(row => this.mergeRow(row.reverse()).reverse());
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
      this.spawnTile();
      this.updateBoard(); // ✅ 僅更新變動數字
    }
  }

  private transpose() {
    this.board = this.board[0].map((_, colIndex) => (
      this.board.map(row => row[colIndex])
    ))
  }

  // ✅ 合併邏輯（高效）
  private mergeRow(row: number[]): number[] {
    const filtered = row.filter(num => num !== 0);
    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        filtered.splice(i + 1, 1); // ✅ 合併後移除
      }
    }
    return [...filtered, ...Array(this.size - filtered.length).fill(0)];
  }



  private triggerMergeAnimation(index: number) {
    const gameContainer = document.querySelector("#game")!;
    const tile = gameContainer.querySelector(`[data-position="${index}-0"]`);
    if (tile) {
      tile.classList.add("tile-merged");
      setTimeout(() => tile.classList.remove("tile-merged"), 200);
    }
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

  // ✅ 更新棋盤數字（僅變動區塊）
  updateBoard() {
    const gameContainer = document.querySelector("#game")!;

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const value = this.board[r][c];
        const tile = gameContainer.querySelector(`[data-position="${r}-${c}"]`);

        if (tile) {
          if (value === 0) {
            tile.textContent = "";
            tile.classList.add("tile-empty");
            tile.classList.remove("tile-new");
          } else {
            tile.textContent = value.toString();
            tile.classList.remove("tile-empty");
            tile.classList.add("tile-new");
            setTimeout(() => tile.classList.remove("tile-new"), 200);
          }
        }
      }
    }
  }


  private createTile(value: number, row: number, col: number): HTMLDivElement {
    const tile = document.createElement('div')
    tile.className = "tile"
    tile.textContent = value.toString();
    tile.style.setProperty("--row", row.toString());
    tile.style.setProperty("--col", col.toString());
    tile.dataset.position = `${row}-${col}`;


    // ✅ 動畫效果
    tile.classList.add("tile-new");
    setTimeout(() => tile.classList.remove("tile-new"), 200);

    return tile;
  }



}