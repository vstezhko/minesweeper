import settings from "./settings";

export const playSound = (type) => {

  if (!settings.soundOn) {
    return
  }

  const sounds = {
    'click': 'assets/sounds/click.mp3',
    'lose': 'assets/sounds/lose.mp3',
    'tick': 'assets/sounds/tick.mp3',
    'win': 'assets/sounds/win.mp3',
  }

  let audio = new Audio();
  audio.src = sounds[type];
  audio.play();

}