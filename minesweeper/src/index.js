import './index.html';
import './styles.scss';
import renderMenuBlock from "./js/renderMenuBlock";
import settings from "./js/settings";
import {Game} from "./js/Game";

window.onload = () => {
  renderMenuBlock()

  const game = new Game(settings);
  game.createNewGame()
};
