


startGame(16, 16, 40);

function startGame(width, height, bombsCount) {
    let gameField = document.querySelector('.gameField'); // ссылка на игровое поле
    let cellsCount = width*height; // обшее кол-во клеток
    
    gameField.innerHTML = '<button class="cell"></button>'.repeat(cellsCount); // добавляем игровому полю все клетки <button>

    let cells = [...gameField.children]; // массив всех клеток <button>
    // получаем массив бомб в виде перемешанных ячеек и обрезания массива по количеству бомб.
    let bombs = [...Array(cellsCount).keys()].sort(()=> Math.random() - 0.5).slice(0, bombsCount);
    let closedCount = cellsCount;

    // клик игрока по кнопке поля
    gameField.addEventListener('click', onCellClick);

    function onCellClick(event) {
        if(event.target.className != "cell") return;

        let index = cells.indexOf(event.target); 
        let column = index % width;
        let row = Math.floor(index / width);
        open(row, column);
    }
    // проверка клетки "бомба ли это"
    function isBomb(row, column) {
        if(!isValid(row, column)) return false;
        let cellIndex = row * width + column;
        return bombs.includes(cellIndex);
    }
    function open(row, column) {
        if(!isValid(row, column)) return;

        let index = row * width + column;
        let cell = cells[index];

        if(cell.disabled) return;

        cell.disabled = true;

        if(isBomb(row, column)) {
            cell.innerHTML = "💣";
            onLoose();
            return;
        }
        closedCount--;
        if(checkForWin()) return;

        let count = getCountOfMinesNearby(row, column);
        if(count !== 0) {
            cell.innerHTML = count;
            return;
        }
        else {
            for(let x = -1; x <= 1; x++) {
                for(let y = -1; y <= 1; y++) {
                    open(row +y, column + x);
                }
            }
        }
    }
    function getCountOfMinesNearby(row, column) {
        let count = 0;
        for(let x = -1; x <= 1; x++) {
            for(let y = -1; y <= 1; y++) {
                if(isBomb(row +y, column + x)) count++;
            }
        }
        return count;
    }
    function isValid(row, column) {
        if(row >=0 && row < height && column >=0 && column < width) return true;
        else return false;
    }
   
    function checkForWin() {
        if(closedCount <= bombsCount) {
            alert("Победа!");
            return true;
        }
        else return false;
    }
    function onLoose() {
        alert('Вы проиграли!');
    }
}