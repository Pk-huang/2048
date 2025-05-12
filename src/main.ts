// src/main.ts
import './style.css';
import { Game } from './feature/game2048/Game';


// src/main.ts
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <h1>2048 小遊戲</h1>
  <div id="game"></div>
`;

// 初始化遊戲
const game = new Game(4);
game.initilize();
