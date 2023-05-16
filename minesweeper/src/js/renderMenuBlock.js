import settings from "./settings";
import {Popup} from "./Popup";

const renderMenuBlock = () => {
  const gameInfoLayout = document.createElement('div')
  gameInfoLayout.classList.add('game-info')
  gameInfoLayout.innerHTML =
    `<h1 class="game-info_title">Игра сапер</h1>
      <div class="game-info_info">
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
      <div class="game-info_quick-settings">
        <img src="assets/img/volume_up_white_24dp.png" alt="volume">
        <img class="settings-icon" src="assets/img/settings.png" alt="settings">
      </div>
    `
  document.body.append(gameInfoLayout)

  const settingsIcon = document.querySelector('.settings-icon')
  settingsIcon.addEventListener('click', () => {
    const settingsPopup = new Popup('settings', settings)
    settingsPopup.renderPopup()
  })
}

export default renderMenuBlock;