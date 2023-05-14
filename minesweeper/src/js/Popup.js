export class Popup {
  constructor(type) {
    this.type = type;
  }

  createPopup() {
    const popup = document.createElement('div')
    popup.classList.add('popup')
    popup.innerHTML =
      `<div class="popup_body">
        <h3>You are lose! Try again?</h3>
        <div class="popup_variants">
          <h5 class="new-game">Yes, start new game</h5>
          <h5 class="show-res">No, show results</h5>
        </div>
      </div>
      `
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

    newGameBtn.addEventListener('click', ()=>{
      this.removePopup()
    })
  }
}