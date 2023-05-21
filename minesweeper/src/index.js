import './index.html';
import './styles.scss';
import renderMenuBlock from "./js/renderMenuBlock";
import settings from "./js/settings";
import {Game} from "./js/Game";

window.onload = () => {

  if (window.innerWidth < 500) {
    settings.mobileMode = true;
  }

  renderMenuBlock()
  const game = new Game(settings);
  game.createNewGame()
};
