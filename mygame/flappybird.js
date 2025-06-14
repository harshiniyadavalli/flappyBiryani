// Board setup
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// Bird setup
let birdWidth = 120;
let birdHeight = 120;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
};

// Pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// Physics
let velocityX = -2;
let velocityY = 0;
let gravity = 0.3;

let gameOver = false;
let score = 0;

// Background
let backgroundImg;

window.onload = function () {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    // Load bird image
    birdImg = new Image();
    birdImg.src = "./flappybird.png";

    // Load pipes
    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    // Load background
    backgroundImg = new Image();
    backgroundImg.src = "./flappybirdbg.jpg";

    backgroundImg.onload = function () {
        requestAnimationFrame(update);
    };

    setInterval(placePipes, 1500);
    document.addEventListener("keydown", moveBird);
};

function update() {
    requestAnimationFrame(update);
    if (gameOver) return;

    // Draw background
    context.drawImage(backgroundImg, 0, 0, board.width, board.height);

    // Apply physics
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) gameOver = true;

    // Draw and move pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    // Clear off-screen pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    // Score display
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillText("GAME OVER", 5, 90);
    }

    // Draw hitbox (debug)
    const hitboxSize = 60;
    const offset = (bird.width - hitboxSize) / 2;
    context.strokeStyle = "red";
    context.lineWidth = 2;
    context.strokeRect(
        bird.x + offset,
        bird.y + offset,
        hitboxSize,
        hitboxSize
    );
}

function placePipes() {
    if (gameOver) return;

    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 2.2;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        velocityY = -6;

        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a, b) {
    const hitboxSize = 60;
    const offset = (a.width - hitboxSize) / 2;

    const box = {
        x: a.x + offset,
        y: a.y + offset,
        width: hitboxSize,
        height: hitboxSize
    };

    return (
        box.x < b.x + b.width &&
        box.x + box.width > b.x &&
        box.y < b.y + b.height &&
        box.y + box.height > b.y
    );
}
