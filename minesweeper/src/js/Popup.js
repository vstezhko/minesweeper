import renderMenuBlock from "./renderMenuBlock";
import settings from "./settings";
import {Game} from "./Game";
import {logPlugin} from "@babel/preset-env/lib/debug";

const levels = {
  'easy': {
    fieldSize: 10,
    minesCount: 10,
    cellSize: 40,
  },
  'medium': {
    fieldSize: 15,
    minesCount: 28,
    cellSize: 25,
  },
  'hard': {
    fieldSize: 25,
    minesCount: 60,
    cellSize: 18,
  }
}

export class Popup {
  constructor(type, settings = null, cell = null) {
    this.type = type;
    this.cell = cell;
    this.settings = settings;
    this.winTemplate = `You are win! Try again?`;
    this.loseTemplate = `You are lose! Try again?`;
    this.popup = null;
  }

  createPopup() {
    const popup = document.createElement('div')
    popup.classList.add('popup')

    if (this.type === 'win' || this.type === 'lose') {
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
            
            <label for="level" class="">Difficulty level</label>
            <select class="input" id="level" name="level">
              <option value="easy" ${settings.level === 'easy' ? 'selected' : ''}>easy</option>
              <option value="medium" ${settings.level === 'medium' ? 'selected' : ''}>medium</option>
              <option value="hard" ${settings.level === 'hard' ? 'selected' : ''}>hard</option>
              <option value="custom" ${settings.level === 'custom' ? 'selected' : ''}>custom</option>
            </select> 
            
            <hr>
          
            <label for="fieldSize">Field size</label>
            <input class="input" id="fieldSize" type="number" max="25" min="5" value=${this.settings.fieldSize}>
          
            <hr>
          
            <label for="minesCount" class="">Mines count</label>
            <input class="input" id="minesCount" type="number" max="99" min="10" value=${this.settings.minesCount}>
          
          </div>
      `
    }

    if (this.type === 'results') {
      const results = JSON.parse(localStorage.getItem('lastResults')) || []
      let resultsHTML = ''
      if (results.length === 0) {
        resultsHTML = '<h5>Результатов пока нет</h5>'
      } else {
          results.forEach(result => {
            resultsHTML += `<li>${result.result}, level: ${result.level}, clicks: ${result.clicksCount}, field size: ${result.fieldSize}, minesCount: ${result.minesCount}</li>`
        })
      }

      popup.innerHTML =
        `
          <div class="popup_body">
            <img class="close-icon" src="assets/img/close_white_24dp.png" alt="close">
            <h3>LAST 10 RESULTS</h3>
            ${resultsHTML}
          </div>
        `
    }

    if (this.type === 'chooseAction') {
      popup.innerHTML =
        `
        <div class="popup_body">
          <div class="popup_variants">
            <h5 class="openCell">open cell</h5>
            <h5 class="flagCell">toggle flag</h5>
          </div>
        </div>
        `
    }

    return popup
  }

  removePopup() {
    const popup = document.querySelector('.popup')
    popup &&
    document.body.removeChild(popup)
  }

  startNewGame()  {
    this.removePopup()
    document.body.removeChild(document.body.querySelector('canvas'))
    document.body.removeChild(document.body.querySelector('.game-info'))
    renderMenuBlock();
    const newGame = new Game(settings);
    newGame.createNewGame();
  }

  renderPopup(game) {
    this.popup = this.createPopup()
    document.body.append(this.popup)

    const popupBody = document.querySelector('.popup_body')
    popupBody &&
      popupBody.addEventListener('click', (e) => {
        e.stopPropagation()
      })

      this.popup.addEventListener('click', (e) => {
        (this.type !== 'results' && this.type !== 'chooseAction') ? this.startNewGame() : this.removePopup()
    })

    const newGameBtn = document.querySelector('.new-game')
    const showResBtn = document.querySelector('.show-res')

    newGameBtn &&
    newGameBtn.addEventListener('click', ()=>{
      this.startNewGame()
    })

    showResBtn &&
    showResBtn.addEventListener('click', () => {
      this.removePopup()
      const resultsPopup = new Popup('results')
      resultsPopup.createPopup()
      resultsPopup.renderPopup()
    })

    const openCell = document.querySelector('.openCell')
    openCell &&
      openCell.addEventListener('click', () => {
        game.handleOpenCell(this.cell)
        game.renderField()
        this.removePopup()
      })

    const flagCell = document.querySelector('.flagCell')
    flagCell &&
      flagCell.addEventListener('click', () => {
        game.handleFlag(this.cell)
        game.renderField()
        this.removePopup()
      })

    const inputs = document.querySelectorAll('.input');
    inputs.length &&
      inputs.forEach((input) => {

          input.addEventListener('click', (e) => {
            e.stopPropagation();
          })

          input.addEventListener('change', (e) => {
            if (input.nodeName === 'INPUT') {
              settings[e.target.id] = +e.target.value;
              settings.flagsLeft = settings.minesCount;
              settings.level = 'custom';
              const options = document.querySelectorAll('option');
              options.forEach(option => {
                if (option.value === settings.level) {
                  option.selected = true;
                } else {
                  option.removeAttribute('selected');
                }
              })
            }

            if (input.nodeName === 'SELECT') {
              settings.level = input.value;
              settings.fieldSize = levels[input.value].fieldSize;
              settings.minesCount = levels[input.value].minesCount;
              settings.cellSize = levels[input.value].cellSize;
              settings.flagsLeft = levels[input.value].minesCount;

              inputs.forEach((i) => {
                if (i.nodeName === 'INPUT') {
                  i.value = +settings[i.id]
                }
              })
            }
          })
      })

    const closeIcon = document.querySelector('.close-icon')
    closeIcon &&
    closeIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      (this.type !== 'results' && this.type !== 'chooseAction') ? this.startNewGame() : this.removePopup()
    })


    inputs.length &&
      this.popup.addEventListener('click', (e) => {
        this.startNewGame()
      })
  }
}