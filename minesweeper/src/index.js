import './index.html';
import './styles.scss';

window.onload = () => {
  const canvas = document.createElement('canvas');
  document.body.append(canvas)
  const context = canvas.getContext('2d');
  let isMineSet = false;

  const settings = {
    fieldSize: 10,
    cellSize: 40,
    minesCount: 10,
  }

  canvas.width = settings.cellSize * settings.fieldSize;
  canvas.height = settings.cellSize * settings.fieldSize;
  canvas.addEventListener('contextmenu', function(event) {
    event.preventDefault();
  });

  const field = [];
  for (let row = 0; row < settings.fieldSize; row++) {
    field[row] = [];
    for (let col = 0; col < settings.fieldSize; col++) {
      field[row][col] = {
        x: col * settings.cellSize,
        y: row * settings.cellSize,
        mined: false,
        tagged: false,
        opened: false,
        minesNearby: null,
      };
    }
  }

  console.log(field)

  const flagImage = new Image();
  flagImage.src = '/assets/img/flag.png';

  function drawField() {
    console.log(field)
    for (let row = 0; row < settings.fieldSize; row++) {
      for (let col = 0; col < settings.fieldSize; col++) {
        const cell = field[row][col];
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

        context.fillStyle = color;
        context.fillRect(x, y, settings.cellSize, settings.cellSize);

        context.strokeStyle = 'black';
        context.strokeRect(x, y, settings.cellSize, settings.cellSize);

        if (cell.tagged) {
          context.drawImage(flagImage, x, y, settings.cellSize, settings.cellSize);
        }

        if (cell.opened && !cell.mined && cell.minesNearby > 0) {
          context.fillStyle = 'black';
          context.font = '20px Arial';
          context.textAlign = 'center';
          context.textBaseline = 'middle';

          const textX = x + settings.cellSize / 2;
          const textY = y + settings.cellSize / 2;
          context.fillText(cell.minesNearby, textX, textY);
        }
      }
    }
  }

  function setMinesToPlaces(){
    isMineSet = true;
    let minesToPlace = settings.minesCount;
    while (minesToPlace > 0) {
      const row = Math.floor(Math.random() * settings.fieldSize);
      const col = Math.floor(Math.random() * settings.fieldSize);

      if (!field[row][col].mined && !field[row][col].opened) {
        field[row][col].mined = true;
        minesToPlace--;
      }
    }

    for (let row = 0; row < settings.fieldSize; row++) {
      for (let col = 0; col < settings.fieldSize; col++) {
        const checkingCell = field[row][col];
        checkingCell.minesNearby = 0;

        if (row > 0 && col > 0 && field[row - 1][col - 1].mined) {
          checkingCell.minesNearby += 1;
        }

        if (row > 0 && field[row - 1][col].mined) {
          checkingCell.minesNearby += 1;
        }

        if (row > 0 && col < settings.fieldSize - 1 && field[row - 1][col + 1].mined) {
          checkingCell.minesNearby += 1;
        }

        if (col > 0 && field[row][col - 1].mined) {
          checkingCell.minesNearby += 1;
        }

        if (col < settings.fieldSize - 1 && field[row][col + 1].mined) {
          checkingCell.minesNearby += 1;
        }

        if (row < settings.fieldSize - 1 && col > 0 && field[row + 1][col - 1].mined) {
          checkingCell.minesNearby += 1;
        }

        if (row < settings.fieldSize - 1 && field[row + 1][col].mined) {
          checkingCell.minesNearby += 1;
        }

        if (row < settings.fieldSize - 1 && col < settings.fieldSize - 1 && field[row + 1][col + 1].mined) {
          checkingCell.minesNearby += 1;
        }
      }
    }
  }

  canvas.addEventListener('mousedown', function (event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    for (let row = 0; row < settings.fieldSize; row++) {
      for (let col = 0; col < settings.fieldSize; col++) {
        const cell = field[row][col];
        const {x, y} = cell;

        if (mouseX >= x && mouseX < x + settings.cellSize && mouseY >= y && mouseY < y + settings.cellSize) {

          if (event.button === 0) {
            if (!cell.tagged && !cell.opened) {
              cell.opened = true;
            }
          }

          if (event.button === 2) {
            cell.tagged = !cell.tagged;
          }

          break;
        }
      }
    }

    !isMineSet && setMinesToPlaces()
    drawField();
  });

// Инициализация и отрисовка поля
  drawField();
};
