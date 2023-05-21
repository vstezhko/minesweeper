import './index.html';
import './styles.scss';
import renderMenuBlock from "./js/renderMenuBlock";
import settings from "./js/settings";
import {Game} from "./js/Game";

window.onload = () => {

  function hasTouchScreen() {
    return ('maxTouchPoints' in navigator && navigator.maxTouchPoints > 0) || ('msMaxTouchPoints' in navigator && navigator.msMaxTouchPoints > 0);
  }

  const isTouchScreen = hasTouchScreen();

  if (isTouchScreen) {
    settings.mobileMode = true;
  }

  if (window.innerWidth <= 500) {
    settings.needToAdopt = true
  }

  renderMenuBlock()
  const game = new Game(settings);
  settings.game = game;
  game.createNewGame()
};
