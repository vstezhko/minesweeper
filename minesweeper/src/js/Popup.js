import renderMenuBlock from "./renderMenuBlock";
import settings from "./settings";
import {Game} from "./Game";

export class Popup {
  constructor(type, settings = null) {
    this.type = type;
    this.settings = settings;
    this.winTemplate = `You are win! Try again?`;
    this.loseTemplate = `You are lose! Try again?`;
  }

  createPopup() {
    const popup = document.createElement('div')
    popup.classList.add('popup')

    if (this.type !== 'settings') {
      popup.innerHTML =
        `
      <div class="popup_body">
        <h3>${ this.type === 'win' ? this.winTemplate : this.loseTemplate }</h3>
        <div class="popup_variants">
          <h5 class="new-game">Yes, start new game</h5>
          <h5 class="show-res">No, show results</h5>
        </div>
      </div>
      `
    }

    if (this.type === 'settings') {
      popup.innerHTML =
        `
          <div class="popup_body">
            <img class="close-icon" src="assets/img/close_white_24dp.png" alt="close">
            <h3>SETTINGS</h3>
          
            <label for="fieldSize" class="">Field size</label>
            <input id="fieldSize" type="number" max="20" min="3" value=${this.settings.fieldSize}>
          
            <hr>
          
            <label for="minesCount" class="">Mines count</label>
            <input id="minesCount" type="number" max="20" min="1" value=${this.settings.minesCount}>
          
          </div>
      `
    }

    return popup
  }

  removePopup() {
    const popup = document.querySelector('.popup')
    document.body.removeChild(popup)
  }

  renderPopup() {
    const popup = this.createPopup()
    document.body.append(popup)

    const newGameBtn = document.querySelector('.new-game')
    const showResBtn = document.querySelector('.show-res')

    const startNewGame = () => {
      this.removePopup()
      document.body.removeChild(document.body.querySelector('canvas'))
      document.body.removeChild(document.body.querySelector('.game-info'))
      renderMenuBlock();
      const newGame = new Game(settings);
      newGame.createNewGame();
    }

    newGameBtn &&
    newGameBtn.addEventListener('click', ()=>{
      startNewGame()
    })

    const inputs = document.querySelectorAll('input');
    inputs.length &&
      inputs.forEach((input) => {
        input.addEventListener('click', (e) => {
          e.stopPropagation();
          settings[e.target.id] = +e.target.value;
        })
      })

    const closeIcon = document.querySelector('.close-icon')
    closeIcon &&
    closeIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      startNewGame()
    })

    inputs.length &&
      popup.addEventListener('click', (e) => {
        console.log(inputs)
        startNewGame()
      })
  }
}