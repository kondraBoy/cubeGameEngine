// fisso (avvia il motore di gioco)
import { GameEngine } from './core/gameEngine.js';

window.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("renderCanvas");
    const game = new GameEngine(canvas);
    game.start();
});
