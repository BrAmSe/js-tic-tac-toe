import './style.css';
import Game, {GAMEMODES, GAME_RESULTS} from './game.js';


const OVERLAYS = Array.from(document.getElementsByClassName('overlay-text'));
const CELLS = Array.from(document.getElementsByClassName("cell"))

const GAME = new Game(
  CELLS,
  (gameResult) => {
    switch(gameResult) {
      case GAME_RESULTS["win"]:
        document.getElementById("you-win-text").classList.add("visible");
        break;
      case GAME_RESULTS["lose"]:
        document.getElementById("you-loose-text").classList.add("visible");
        break;
      case GAME_RESULTS["draw"]:
        document.getElementById("its-a-draw-text").classList.add("visible");
        break;
      default:
        throw new Error("This result is unexpected");
    }
  }
);

OVERLAYS.forEach(overlay => {
  overlay.addEventListener('click', () => {
      overlay.classList.remove('visible');
      GAME.startGame(GAMEMODES.singlePlayer);
  });
});