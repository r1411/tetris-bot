document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div")); //Все пикселыыыы
  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector("#start-button");
  const width = 10;
  let nextRandom = 0; //Айди первой фигурки, которая появится
  let timerId;
  let score = 0;
  const colors = [
    "orange",
    "red",
    "purple",
    "green",
    "blue",
    "magenta",
    "cyan",
  ];

  //The Tetrominoes
  const jTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const sTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const zTetromino = [
    [width, width + 1, width * 2 + 1, width * 2 + 2],
    [1, width, width + 1, width * 2],
    [width, width + 1, width * 2 + 1, width * 2 + 2],
    [1, width, width + 1, width * 2],
  ];

  const lTetramino = [
    [0, 1, width + 1, width * 2 + 1],
    [2, width, width + 1, width + 2],
    [1, width + 1, width * 2 + 1, width * 2 + 2],
    [0, 1, 2, width],
  ];

  const theTetrominoes = [
    lTetramino,
    jTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
    sTetromino,
  ];

  let currentPosition = 4;
  let currentRotation = 0; //изначальное положение

  console.log(theTetrominoes[0][0]);

  //Рандомный выбор доминошки и ее первое вращение
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  //Нарисовать тетраминошку
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("tetromino");
      squares[currentPosition + index].style.backgroundColor = colors[random];
    });
  }

  //undraw the Tetromino
  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("tetromino");
      squares[currentPosition + index].style.backgroundColor = "";
    });
  }

  //Соответствие нажатий стрелочек и их кейкодов
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }
  document.addEventListener("keyup", control);

  //move down function
  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }

  //freeze function
  function freeze() {
    if (
      current.some(
        (index) =>
          squares[currentPosition + index + width].classList.contains("taken") //Если косаемся зафиксированной
      )
    ) {
      current.forEach(
        (index) => squares[currentPosition + index].classList.add("taken") //тогда фиксируем
      );
      //берем новую фигурку
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

  //Движение влево с проверкой на край карты играемся с тем, что у нас ограниченный грид и все левые пиксели делятся на ширину без остатка
  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );
    if (!isAtLeftEdge) currentPosition -= 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition += 1;
    }
    draw();
  }

  //движение вправо с проверкой на край карты
  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % width === width - 1
    );
    //если не у правого края
    if (!isAtRightEdge) currentPosition += 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition -= 1;
    }
    draw();
  }

  ///Зафиксировать повороты у края эрана
  function isAtRight() {
    return current.some((index) => (currentPosition + index + 1) % width === 0);
  }

  function isAtLeft() {
    return current.some((index) => (currentPosition + index) % width === 0);
  }

  function checkRotatedPosition(P) {
    P = P || currentPosition; //Получить актуальную позицию, затем проверить, деталька возле левой стороны?
    if ((P + 1) % width < 4) {
      //добавляем 1 потому что индекс позиции может быть на 1 меньше, чем место где находится деталька(они так индексируются)
      if (isAtRight()) {
        //смотрит актуальную позицию, чтобы проверить, повернута ли она на right side
        currentPosition += 1; //если так, то поворачиваем ее на один вперед
        checkRotatedPosition(P); //Проверка еще раз. Кидаем стартовую позицию, ибо палке может понадобиться больше места, чтобы сместиться.
      } //TODO: глянуть тут, че за херня
    } else if (P % width > 5) {
      if (isAtLeft()) {
        currentPosition -= 1;
        checkRotatedPosition(P);
      }
    }
  }

  //вращение тетраминошки
  function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) {
      //если уже на 4 позиции, то возвращаем до второй
      currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    checkRotatedPosition();
    draw();
  }
  /////////

  //Переменные, чтобы показывать следующую тетраминошку в окошке
  const displaySquares = document.querySelectorAll(".mini-grid div");
  const displayWidth = 4;
  const displayIndex = 0;

  //Стартовые позиции тетраминошек
  const upNextTetrominoes = [
    [0, 1, displayWidth + 1, displayWidth * 2 + 1], //lTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], //jTetromino
    [
      displayWidth,
      displayWidth + 1,
      displayWidth * 2 + 1,
      displayWidth * 2 + 2,
    ], //zTetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
    [0, 1, displayWidth, displayWidth + 1], //oTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //iTetromino
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //sTetromino
  ];

  //Показывать следующую фигурку в окошке
  function displayShape() {
    //Убрать все, что напоминает о прошлой фигурке из окошка
    displaySquares.forEach((square) => {
      square.classList.remove("tetromino");
      square.style.backgroundColor = "";
    });
    upNextTetrominoes[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add("tetromino");
      displaySquares[displayIndex + index].style.backgroundColor =
        colors[nextRandom];
    });
  }

  //Кнопка стартапаузыыы
  startBtn.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 1000);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape();
    }
  });

  //Ура очки
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];

      if (row.every((index) => squares[index].classList.contains("taken"))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach((index) => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("tetromino");
          squares[index].style.backgroundColor = "";
        });
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }

  //Конец игри
  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      scoreDisplay.innerHTML = "end";
      clearInterval(timerId);
    }
  }
});
