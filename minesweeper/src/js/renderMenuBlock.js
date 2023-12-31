import {Popup} from "./Popup";
import settings from "./settings";

const renderMenuBlock = () => {
  const gameInfoLayout = document.createElement('div')
  gameInfoLayout.classList.add('game-info')
  gameInfoLayout.innerHTML =
    `
    <div class="game-info__container">
      <h1 class="title">Игра сапер</h1>
      <div class="game-info__game-settings">
        ${settings.mobileMode ? '<img class="settings-icon" src="assets/img/settings.png" alt="settings">' : '<h5 class="title">Настроить новую игру</h5>'}
      </div>
    </div>
    <div class="game-info__container">
      <div class="game-info__info">
        <div class="game-info_quick-settings">
          <img class="results-icon" src="assets/img/results_32.png" alt="results" title="last results">
        </div>
        <div class="game-info_quick-settings">
          <img class="darkON-icon ${!settings.darkON ? 'hidden' : ''}" src="assets/img/light.png" alt="theme">
          <img class="darkOFF-icon ${settings.darkON ? 'hidden' : ''}" src="assets/img/dark.png" alt="theme">
        </div>
        <div class="game-info_quick-settings">
          <img class="volumeON-icon ${!settings.soundOn ? 'hidden' : ''}" src="assets/img/volume_up_white_24dp.png" alt="volume">
          <img class="volumeOFF-icon ${settings.soundOn ? 'hidden' : ''}" src="assets/img/volume_off_white_24dp.png" alt="volume">
        </div>
      </div>
      <div class="game-info__info">
        <div class="game-info_flags-left">
          <img src="assets/img/flag_icon.png" alt="flag">
          <p class="flags-left">${settings.flagsLeft}</p>
        </div>
        <div class="game-info_time">
          <img src="assets/img/clock_icon.png" alt="clock">
          <p class="clock">000</p>
        </div>
        <div class="game-info_clicks">
          <img src="assets/img/click.png" alt="click">
          <p class="clicks">000</p>
        </div>
      </div>
    </div>
    `
  document.body.append(gameInfoLayout)

  const settingsButton = document.querySelector('.game-info__game-settings')
  settingsButton.addEventListener('click', () => {
    const settingsPopup = new Popup('settings', settings)
    settingsPopup.renderPopup()
  })

  const volumeONIcon = document.querySelector('.volumeON-icon')
  const volumeOFFIcon = document.querySelector('.volumeOFF-icon')

  volumeONIcon.addEventListener('click', () => {
    settings.soundOn = false;
    volumeONIcon.classList.add('hidden')
    volumeOFFIcon.classList.remove('hidden')
  })

  volumeOFFIcon.addEventListener('click', () => {
    settings.soundOn = true;
    volumeOFFIcon.classList.add('hidden')
    volumeONIcon.classList.remove('hidden')
  })

  const darkONIcon = document.querySelector('.darkON-icon')
  const darkOFFIcon = document.querySelector('.darkOFF-icon')

  darkONIcon.addEventListener('click', () => {

    settings.darkON = false;
    document.body.classList.remove('dark')
    settings.game.renderField()
    darkONIcon.classList.add('hidden')
    darkOFFIcon.classList.remove('hidden')
  })

  darkOFFIcon.addEventListener('click', () => {
    settings.darkON = true;
    document.body.classList.add('dark')
    settings.game.renderField()
    darkOFFIcon.classList.add('hidden')
    darkONIcon.classList.remove('hidden')
  })

  const resultsIcon = document.querySelector('.results-icon')
  resultsIcon.addEventListener('click', () => {
    const resultsPopup = new Popup('results')
    resultsPopup.createPopup()
    resultsPopup.renderPopup()
  })
}

export default renderMenuBlock;