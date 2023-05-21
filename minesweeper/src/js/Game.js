import {gameTime} from "./gameTime";
import {endGame} from "./endGame";
import {playSound} from "./playSound";
import settings from "./settings";
import {Popup} from "./Popup";

export class Game {
  constructor(settings) {
    this.settings = {...settings};
    this.field = [];
    this.context = null;
    this.canvas = null;
    this.isMineSet = false;
    this.hideCells = settings.fieldSize * settings.fieldSize;
    this.lastresults = JSON.parse(localStorage.getItem('lastResults')) || [];
    this.rowSize = null;
    this.columnSize = null;
  }

  countAvailablePlaceForField() {
    if (this.settings.mobileMode) {
      const screenWidth = window.innerWidth;
      this.settings.fieldCells = this.settings.fieldSize * this.settings.fieldSize;
      this.rowSize = Math.floor((screenWidth-20)/settings.cellSize)
      this.columnSize = Math.round(this.settings.fieldCells/this.rowSize)
      this.hideCells = this.rowSize * this.columnSize
    } else {
      this.rowSize = this.settings.fieldSize
      this.columnSize = this.settings.fieldSize
    }
  }

  createNewGame() {
    this.countAvailablePlaceForField()
    for (let row = 0; row < this.columnSize; row++) {
      this.field[row] = [];
      for (let col = 0; col < this.rowSize; col++) {
        this.field[row][col] = {
          x: col * this.settings.cellSize,
          y: row * this.settings.cellSize,
          mined: false,
          tagged: false,
          opened: false,
          minesNearby: null,
        };
      }
    }

    this.createField()
    this.renderField()
    this.changeFlagsLeftInfo()
  }

  renderField(){
    for (let row = 0; row < this.columnSize; row++) {
      for (let col = 0; col < this.rowSize; col++) {
        const cell = this.field[row][col];
        const {x, y} = cell;

        let color;

        if (cell.opened && cell.mined) {
          color = 'red';
        }

        if (cell.opened && !cell.mined) {
          color = 'lightgreen';
        }

        if (!cell.opened) {
          color = 'lightgray';
        }

        this.context.fillStyle = color;
        this.context.fillRect(x, y, this.settings.cellSize, this.settings.cellSize);

        this.context.strokeStyle = 'palevioletred';
        this.context.strokeRect(x, y, this.settings.cellSize, this.settings.cellSize);

        const flagImage = new Image();
        flagImage.src = './assets/img/flag_icon.png';

        if (cell.tagged) {
          this.context.drawImage(flagImage, x, y, this.settings.cellSize, this.settings.cellSize);
        }

        if (cell.opened && !cell.mined && cell.minesNearby > 0) {
          this.context.fillStyle = 'black';
          this.context.font = '16px Arial';
          this.context.textAlign = 'center';
          this.context.textBaseline = 'middle';

          const textX = x + this.settings.cellSize / 2;
          const textY = y + this.settings.cellSize / 2;
          this.context.fillText(cell.minesNearby, textX, textY);
        }
      }
    }
  }

  openCell(cell) {
    if (!cell.opened) {
      cell.opened = true
      this.hideCells -= 1;
    }
  }

  checkCellsNearby(cell) {

    if (cell.minesNearby !== 0) {
      return
    }

    const {x, y} = cell;
    const b = x / this.settings.cellSize;
    const a = y / this.settings.cellSize;

    const checkingCells = [
      this.field[a - 1] !== undefined ? this.field[a - 1][b - 1] : undefined,
      this.field[a - 1] !== undefined ? this.field[a - 1][b] : undefined,
      this.field[a - 1] !== undefined  ? this.field[a - 1][b + 1] : undefined,
      this.field[a] !== undefined  ? this.field[a][b - 1] : undefined,
      this.field[a] !== undefined  ? this.field[a][b + 1] : undefined,
      this.field[a + 1] !== undefined  ? this.field[a + 1][b - 1] : undefined,
      this.field[a + 1] !== undefined  ? this.field[a + 1][b] : undefined,
      this.field[a + 1] !== undefined  ? this.field[a + 1][b + 1] : undefined
    ]

    checkingCells.forEach((cell) => {
      try {

        if (cell.minesNearby === 0 && !cell.opened) {
          if (cell.tagged){
            cell.tagged = false;
            this.settings.flagsLeft += 1;
            this.changeFlagsLeftInfo()
          }
          this.openCell(cell)
          this.checkCellsNearby(cell)
        } else {
          if (cell.tagged){
            cell.tagged = false;
            this.settings.flagsLeft += 1;
            this.changeFlagsLeftInfo()
          }
          this.openCell(cell)
        }
      } catch {}
    })
  }

  handleOpenCell(cell) {

      if (cell.opened) {
        return
      }

      if (!cell.tagged && !cell.opened) {
        this.settings.clicksCount += 1
        this.changeClickCountInfo()
        this.openCell(cell)
        !cell.mined && playSound('click')

        !this.isMineSet && this.setMinesToPlaces() && this.checkCellsNearby(cell);
        !cell.mined && this.checkCellsNearby(cell);
      }

      if (cell.mined && !cell.tagged) {
        playSound('lose')
        this.openAllCells()
        endGame('lose');
        this.saveResult('lose')
        return
      }

      if (this.hideCells === this.settings.minesCount) {
        // console.log('win')
        playSound('win')
        this.openAllCells();
        endGame('win');
        this.saveResult('win')
      }
  }

  handleFlag(cell) {
    if (cell.opened) {
      return
    }

    playSound('tick')
    if (this.settings.flagsLeft > 0 && !cell.tagged) {
      cell.tagged = true;
      this.settings.flagsLeft -= 1
      this.changeFlagsLeftInfo()
      return
    }

    if (cell.tagged && this.settings.flagsLeft < this.settings.minesCount) {
      cell.tagged = false;
      this.settings.flagsLeft += 1
      this.changeFlagsLeftInfo()
    }
  }

  createField() {
    this.canvas = document.createElement('canvas');
    document.body.append(this.canvas)
    this.context = this.canvas.getContext('2d');
    this.canvas.width = this.settings.cellSize * this.rowSize;
    this.canvas.height = this.settings.cellSize * this.columnSize;

    this.canvas.addEventListener('dblclick', function(event) {
      event.preventDefault();
    });

    this.canvas.addEventListener('contextmenu', function (event) {
      event.preventDefault();
    });

    this.canvas.addEventListener('mousedown',  (event) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      for (let row = 0; row < this.columnSize; row++) {
        for (let col = 0; col < this.rowSize; col++) {
          const cell = this.field[row][col];
          const {x, y} = cell;

          if (mouseX >= x && mouseX < x + this.settings.cellSize && mouseY >= y && mouseY < y + this.settings.cellSize) {

            if (this.settings.mobileMode) {
              if ("vibrate" in navigator) {
                navigator.vibrate(100);
              }
              const actionPopup = new Popup('chooseAction', settings, cell)
              actionPopup.renderPopup(this)
            } else {
              if (event.button === 0) {
                this.handleOpenCell(cell)
              }

              if (event.button === 2) {
                this.handleFlag(cell)
              }
            }
          }
        }
      }

      this.renderField();
    })
  }

  setMinesToPlaces() {
    gameTime()
    this.isMineSet = true;
    let minesToPlace = this.settings.minesCount;
    while (minesToPlace > 0) {
      const row = Math.floor(Math.random() * this.columnSize);
      const col = Math.floor(Math.random() * this.rowSize);

      if (!this.field[row][col].mined && !this.field[row][col].opened) {
        this.field[row][col].mined = true;
        console.log(row, col)
        minesToPlace--;
      }
    }

    for (let row = 0; row < this.columnSize; row++) {
      for (let col = 0; col < this.rowSize; col++) {
        const checkingCell = this.field[row][col];
        checkingCell.minesNearby = 0;

        if (row > 0 && col > 0 && this.field[row - 1][col - 1].mined) {
          checkingCell.minesNearby += 1;
        }

        if (row > 0 && this.field[row - 1][col].mined) {
          checkingCell.minesNearby += 1;
        }

        if (row > 0 && col < this.rowSize - 1 && this.field[row - 1][col + 1].mined) {
          checkingCell.minesNearby += 1;
        }

        if (col > 0 && this.field[row][col - 1].mined) {
          checkingCell.minesNearby += 1;
        }

        if (col < this.rowSize - 1 && this.field[row][col + 1].mined) {
          checkingCell.minesNearby += 1;
        }

        if (row < this.columnSize - 1 && col > 0 && this.field[row + 1][col - 1].mined) {
          checkingCell.minesNearby += 1;
        }

        if (row < this.columnSize - 1 && this.field[row + 1][col].mined) {
          checkingCell.minesNearby += 1;
        }

        if (row < this.columnSize - 1 && col < this.rowSize - 1 && this.field[row + 1][col + 1].mined) {
          checkingCell.minesNearby += 1;
        }
      }
    }
  }

  openAllCells() {
    this.field.forEach((row) => {
      row.forEach((item) => {
        item.opened = true;
      })
    })
    this.renderField();

  }

  saveResult(res) {
    const result = {
      fieldSize: this.settings.fieldSize ,
      minesCount: this.settings.minesCount,
      level: this.settings.level,
      clicksCount: this.settings.clicksCount,
      result: res,
    }

    this.lastresults.unshift(result)
    if (this.lastresults.length >= 11) {
      this.lastresults.pop()
    }
    localStorage.setItem('lastResults', JSON.stringify(this.lastresults))
  }

  changeFlagsLeftInfo() {
    const flagsLeftNode = document.querySelector('.flags-left')
    flagsLeftNode.innerHTML = this.settings.flagsLeft;
  }

  changeClickCountInfo() {
    const clicks = document.querySelector('.clicks')
    clicks.innerHTML = this.settings.clicksCount;
  }
}