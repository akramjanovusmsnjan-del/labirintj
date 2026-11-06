
const mazeElement = document.getElementById("maze");
const levelText = document.getElementById("level");
const movesText = document.getElementById("moves");
const timeText = document.getElementById("time");
const message = document.getElementById("message");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const mazes = [
    [
        "###########",
        "#P#.......#",
        "#.#.#####.#",
        "#.#.....#.#",
        "#.#####.#.#",
        "#.....#.#.#",
        "#####.#.#.#",
        "#.....#...#",
        "#.#######.#",
        "#........E#",
        "###########"
    ],
    [
        "###########",
        "#P........#",
        "####.###..#",
        "#....#....#",
        "#.####.##.#",
        "#......#..#",
        "##.####.#.#",
        "#....#...##",
        "#.##...#..#",
        "#........E#",
        "###########"
    ],
    [
        "###########",
        "#P#.......#",
        "#.#.#####.#",
        "#...#...#.#",
        "###.#.#.#.#",
        "#...#.#...#",
        "#.###.###.#",
        "#.....#...#",
        "#.#####.###",
        "#........E#",
        "###########"
    ]
];

let currentLevel = 0;
let player = { x: 1, y: 1 };
let moves = 0;
let seconds = 0;
let gameStarted = false;
let timer = null;

function drawMaze() {
    const layout = mazes[currentLevel];

    mazeElement.innerHTML = "";
    mazeElement.style.gridTemplateColumns =
        `repeat(${layout[0].length}, 1fr)`;
    mazeElement.style.gridTemplateRows =
        `repeat(${layout.length}, 1fr)`;

    layout.forEach((row, y) => {
        [...row].forEach((cell, x) => {
            const div = document.createElement("div");
            div.className = "cell";

            if (cell === "#") {
                div.classList.add("wall");
            } else {
                div.classList.add("path");
            }

            if (cell === "E") {
                div.classList.add("exit");
                div.textContent = "🏁";
            }

            if (player.x === x && player.y === y) {
                div.className = "cell player";
                div.textContent = "🧑";
            }

            mazeElement.appendChild(div);
        });
    });
}

function updateStats() {
    levelText.textContent = currentLevel + 1;
    movesText.textContent = moves;
    timeText.textContent = seconds;
}

function startTimer() {
    if (timer) return;

    timer = setInterval(() => {
        if (gameStarted) {
            seconds++;
            timeText.textContent = seconds;
        }
    }, 1000);
}

function startGame() {
    clearInterval(timer);
    timer = null;

    currentLevel = 0;
    player = { x: 1, y: 1 };
    moves = 0;
    seconds = 0;
    gameStarted = true;

    message.textContent = "Chiqish eshigini top!";
    updateStats();
    drawMaze();
    startTimer();

    startBtn.textContent = "O‘YIN BOSHLANDI";
}

function movePlayer(dx, dy) {
    if (!gameStarted) {
        message.textContent = "Avval o‘yinni boshlang!";
        return;
    }

    const newX = player.x + dx;
    const newY = player.y + dy;

    const layout = mazes[currentLevel];

    if (
        newY < 0 ||
        newY >= layout.length ||
        newX < 0 ||
        newX >= layout[0].length
    ) {
        return;
    }

    if (layout[newY][newX] === "#") {
        message.textContent = "⛔ Devor! Boshqa yo‘lni tanlang.";
        return;
    }

    player.x = newX;
    player.y = newY;
    moves++;

    updateStats();
    drawMaze();

    if (layout[newY][newX] === "E") {
        nextLevel();
    } else {
        message.textContent = "Yaxshi! Yo‘lingni davom ettir.";
    }
}

function nextLevel() {
    if (currentLevel < mazes.length - 1) {
        message.textContent = "🎉 Ajoyib! Keyingi bosqich ochildi!";

        currentLevel++;

        const layout = mazes[currentLevel];

        for (let y = 0; y < layout.length; y++) {
            for (let x = 0; x < layout[y].length; x++) {
                if (layout[y][x] === "P") {
                    player = { x, y };
                }
            }
        }

        updateStats();
        drawMaze();
    } else {
        finishGame();
    }
}

function finishGame() {
    gameStarted = false;
    clearInterval(timer);
    timer = null;

    mazeElement.innerHTML = `
        <div style="
            grid-column: 1 / -1;
            grid-row: 1 / -1;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            text-align:center;
            gap:15px;
            color:#ffd21f;
            padding:15px;
        ">
            <div style="font-size:55px">🏆</div>
            <h2>G‘ALABA!</h2>
            <p>Barcha labirintlardan chiqdingiz!</p>
            <p>Yurishlar: ${moves}</p>
            <p>Vaqt: ${seconds} soniya</p>
        </div>
    `;

    message.textContent = "Tabriklaymiz! Siz barcha bosqichlarni tugatdingiz!";
    startBtn.textContent = "QAYTA O‘YNASH";
}

function restartGame() {
    startGame();
}

document.addEventListener("keydown", (event) => {
    const keys = {
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0]
    };

    if (keys[event.key]) {
        event.preventDefault();
        movePlayer(...keys[event.key]);
    }
});

document.querySelectorAll(".control").forEach(button => {
    button.addEventListener("click", () => {
        const directions = {
            up: [0, -1],
            down: [0, 1],
            left: [-1, 0],
            right: [1, 0]
        };

        movePlayer(...directions[button.dataset.direction]);
    });
});

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);

drawMaze();
updateStats();
