import {timer} from "./gameTime";
import {Popup} from "./Popup";

export const endGame = (result) => {
  clearTimeout(timer)
  const popup = new Popup(result)
  setTimeout(()=>popup.renderPopup(), 1000)
}