import {timer} from "./gameTime";
import {Popup} from "./Popup";

export const loseGame = () => {
  clearTimeout(timer)
  const popup = new Popup('lose')
  popup.renderPopup()
}