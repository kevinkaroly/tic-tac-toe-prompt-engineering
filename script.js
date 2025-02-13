let fields = [null, null, null, null, null, null, null, null, null];
let currentPlayer = "circle";
let gameOver = false;

function init() {
  render();
}

function render() {
  const contentDiv = document.getElementById("content");

  let tableHtml = `<table>`;
  for (let i = 0; i < 3; i++) {
    tableHtml += `<tr>`;
    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j;
      let symbol = "";
      if (fields[index] === "circle") {
        symbol = generateCircleSVG();
      } else if (fields[index] === "cross") {
        symbol = generateXSVG();
      }
      tableHtml += `<td id="cell-${index}" onclick="handleClick(${index})">${symbol}</td>`;
    }
    tableHtml += `</tr>`;
  }
  tableHtml += `</table>`;

  contentDiv.innerHTML = tableHtml;
}

function handleClick(index) {
  if (fields[index] === null && !gameOver) {
    fields[index] = currentPlayer;
    const cell = document.getElementById(`cell-${index}`);
    cell.innerHTML =
      currentPlayer === "circle" ? generateCircleSVG() : generateXSVG();
    cell.removeAttribute("onclick");

    const winner = checkWinner();
    if (winner) {
      gameOver = true;
      drawWinningLine(winner);
      return;
    }

    currentPlayer = currentPlayer === "circle" ? "cross" : "circle";
  }
}

function checkWinner() {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
      return combination;
    }
  }
  return null;
}

function drawWinningLine(winningCells) {
  const content = document.getElementById("content");
  const table = document.querySelector("table");

  const firstCell = document.getElementById(`cell-${winningCells[0]}`);
  const lastCell = document.getElementById(`cell-${winningCells[2]}`);

  const contentRect = content.getBoundingClientRect();
  const firstRect = firstCell.getBoundingClientRect();
  const lastRect = lastCell.getBoundingClientRect();

  const x1 = firstRect.left - contentRect.left + firstRect.width / 2;
  const y1 = firstRect.top - contentRect.top + firstRect.height / 2;
  const x2 = lastRect.left - contentRect.left + lastRect.width / 2;
  const y2 = lastRect.top - contentRect.top + lastRect.height / 2;

  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

  const line = document.createElement("div");
  line.style.position = "absolute";
  line.style.backgroundColor = "white";
  line.style.height = "5px";
  line.style.borderRadius = "5px";
  line.style.transformOrigin = "center";
  line.style.transition = "width 0.5s ease-in-out";
  line.style.zIndex = "10";
  line.style.left = `${x1}px`;
  line.style.top = `${y1}px`;
  line.style.transform = `rotate(${angle}deg)`;
  line.style.transformOrigin = `top left`;
  line.style.width = "0px"; // Startet bei 0 für Animation

  content.appendChild(line);

  setTimeout(() => {
    line.style.width = `${length}px`;
  }, 10);
}

function restartGame() {
    fields = [null, null, null, null, null, null, null, null, null];
    render();
}

function generateCircleSVG() {
  const color = "#00B0EF";
  const width = 70;
  const height = 70;

  return `
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
            <circle cx="${width / 2}" cy="${
    height / 2
  }" r="30" stroke="${color}" stroke-width="5" fill="none" 
                stroke-dasharray="188.4" stroke-dashoffset="188.4">
                <animate attributeName="stroke-dashoffset" from="188.4" to="0" dur="200ms" fill="freeze"/>
            </circle>
        </svg>
    `;
}

function generateXSVG() {
  const color = "#FFC000";
  const width = 70;
  const height = 70;
  const strokeWidth = 5;

  return `
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="0" x2="${width}" y2="${height}" stroke="${color}" stroke-width="${strokeWidth}" stroke-dasharray="99" stroke-dashoffset="99">
                <animate attributeName="stroke-dashoffset" from="99" to="0" dur="200ms" fill="freeze"/>
            </line>
            <line x1="${width}" y1="0" x2="0" y2="${height}" stroke="${color}" stroke-width="${strokeWidth}" stroke-dasharray="99" stroke-dashoffset="99">
                <animate attributeName="stroke-dashoffset" from="99" to="0" dur="200ms" fill="freeze" begin="100ms"/>
            </line>
        </svg>
    `;
}
