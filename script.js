let gridSize = 32;
let brushSize = 1;
let isRandomColor = false;
let sensitiveMouse = false;
const artboard = document.querySelector(".artboard");
const color = document.querySelector("input.color");
const slideContainer = document.querySelector(".slide-container");
const brush = document.querySelector(".brush-size");
const showGrid = document.querySelector("button.show-grid");
const mouseSense = document.querySelector("button.mouse-sense");
const randomizeColors = document.querySelector("button.randomize-colors");
const eraser = document.querySelector("button.eraser");
const slowDraw = document.querySelector("button.slow-draw");
const reset = document.querySelector("button.reset");
const loading = document.querySelector(".loading");

initializeButtons();
generateGrid();

function initializeButtons() {
  color.addEventListener("click", () => {
    if (isRandomColor == true) {
      isRandomColor = false;
      randomizeColors.classList.remove("selected-button");
    }
    if (eraser.classList.contains("selected-button")) {
      eraser.classList.remove("selected-button");
    }
  });

  slideContainer.firstElementChild.addEventListener("change", () => {
    gridSize = slideContainer.firstElementChild.value;
    slideContainer.lastElementChild.textContent = `${gridSize} x ${gridSize}`;
    loading.style.display = "flex";
    generateGrid();
    setTimeout(() => (loading.style.display = "none"), 800);
  });

  brush.addEventListener("change", () => {
    if (brush.value == "small") {
      brushSize = 1;
    } else if (brush.value == "medium") {
      brushSize = 4;
    } else if ((brush.value = "large")) {
      brushSize = 12;
    }
  });

  showGrid.addEventListener("click", () => {
    const squares = Array.from(artboard.children);
    if (showGrid.classList.contains("selected-button")) {
      for (square in squares) {
        squares[square].style.border = "none";
      }
    } else {
      for (square in squares) {
        squares[square].style.border = "thin solid rgba(54, 54, 54, 0.2)";
      }
    }
    showGrid.classList.toggle("selected-button");
  });

  mouseSense.addEventListener("click", () => {
    sensitiveMouse == true ? (sensitiveMouse = false) : (sensitiveMouse = true);
    mouseSense.classList.toggle("selected-button");
    generateGrid();
  });

  randomizeColors.addEventListener("click", () => {
    if (isRandomColor == false) {
      isRandomColor = true;
      color.value = "#000000";
      eraser.classList.remove("selected-button");
    } else {
      isRandomColor = false;
    }
    randomizeColors.classList.toggle("selected-button");
  });

  eraser.addEventListener("click", () => {
    if (color.value != "#ffffff") {
      color.value = "#ffffff";
      if (isRandomColor == true) {
        isRandomColor = false;
        randomizeColors.classList.remove("selected-button");
      }
    } else {
      color.value = "#000000";
    }
    eraser.classList.toggle("selected-button");
  });

  slowDraw.addEventListener("click", () => {
    if (!slowDraw.classList.contains("selected-button")) {
      slowDraw.classList.add("selected-button");
      document.querySelectorAll(".grid-square").forEach((square) => {
        square.style.transition = "background-color 1s";
      });
    } else {
      slowDraw.classList.remove("selected-button");
      document.querySelectorAll(".grid-square").forEach((square) => {
        square.style.transition = "background-color 0.1s";
      });
    }
  });

  reset.addEventListener("click", () => {
    reset.classList.toggle("selected-button");
    loading.style.display = "flex";
    generateGrid();
    setTimeout(() => {
      loading.style.display = "none";
    }, 800);
  });
}

function opacity() {
  return { opacity: 0.2 };
}

function generateGrid() {
  resetTools();
  const existingBoard = Array.from(artboard.children);
  const boardLength = existingBoard.length;
  if (boardLength > 0) {
    for (let i = 0; i < existingBoard.length; i++) {
      artboard.removeChild(existingBoard[i]);
    }
  }

  for (let i = 0; i < gridSize * gridSize; i++) {
    const div = document.createElement("div");
    if (sensitiveMouse) {
      div.style.opacity = 0.2;
    }
    div.classList.add("grid-square");
    artboard.appendChild(div);
  }
  artboard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  artboard.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

  const squares = document.querySelectorAll(".grid-square");
  let clicked = false;

  squares.forEach((square) => {
    square.addEventListener("mouseover", () => {
      if (clicked) {
        let opacity = square.style.opacity;
        square.style.opacity = parseFloat(opacity) + 0.2;
        activateBrush(squares, square);
      }
    });
    square.addEventListener("mousedown", () => {
      if (clicked == false) {
        clicked = true;
        let opacity = square.style.opacity;
        if (opacity < 1) {
          if (sensitiveMouse) {
            square.style.opacity = parseFloat(opacity) + 0.4;
          }
          activateBrush(squares, square);
        }
      } else clicked = false;
    });
    document.addEventListener("mouseup", () => {
      if (clicked == true) {
        clicked = false;
      }
    });
  });
}

function activateBrush(squares, square) {
  if (brushSize == 1) {
    square.style.backgroundColor = isRandomColor
      ? generateColor()
      : color.value;
  } else {
    const currSquare = Array.from(squares).indexOf(square);
    squares[currSquare].style.backgroundColor = isRandomColor
      ? generateColor()
      : color.value;
    squares[currSquare - gridSize].style.backgroundColor = isRandomColor
      ? generateColor()
      : color.value;
    if (!((currSquare - 1) % gridSize == gridSize - 1)) {
      squares[currSquare - 1].style.backgroundColor = isRandomColor
        ? generateColor()
        : color.value;
      squares[currSquare - gridSize - 1].style.backgroundColor = isRandomColor
        ? generateColor()
        : color.value;
    }
    if (brushSize == 12) {
      if (!(currSquare % gridSize == gridSize - 1)) {
        squares[currSquare + 1].style.backgroundColor = isRandomColor
          ? generateColor()
          : color.value;
        squares[currSquare - gridSize + 1].style.backgroundColor = isRandomColor
          ? generateColor()
          : color.value;
      }
      if (currSquare + gridSize <= gridSize * gridSize) {
        squares[currSquare + gridSize].style.backgroundColor = isRandomColor
          ? generateColor()
          : color.value;
        if (!(currSquare % gridSize == gridSize - 1)) {
          squares[currSquare + gridSize + 1].style.backgroundColor =
            isRandomColor ? generateColor() : color.value;
        }
        if (!((currSquare - 1) % gridSize == gridSize - 1)) {
          squares[currSquare + gridSize - 1].style.backgroundColor =
            isRandomColor ? generateColor() : color.value;
        }
      }
    }
  }
}

// Hex to RGB function thanks to Tim Down on Stack Overflow - https://stackoverflow.com/a/5624139/19874960
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function resetTools() {
  color.value = "#000000";
  isRandomColor = false;
  document.querySelectorAll("button").forEach((btn) => {
    if (btn != mouseSense) {
      btn.style.opacity = "0.8";
      btn.classList.remove("selected-button");
    }
  });
}

function generateColor() {
  return `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
    Math.random() * 255
  })`;
}
