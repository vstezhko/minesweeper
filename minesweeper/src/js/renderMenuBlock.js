import settings from "./settings";

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
      </div>
      <div class="game-info_quick-settings">
        <img src="assets/img/volume_up_white_24dp.png" alt="volume">
        <img src="assets/img/settings.png" alt="settings">
      </div>
    `
  document.body.append(gameInfoLayout)
}

export default renderMenuBlock;