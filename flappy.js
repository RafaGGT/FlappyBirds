const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const gameContainer = document.getElementById('game-container');

const fImg = new Image();
fImg.src = 'img/ave.png';
fImg.onload = function() {
    loop();
};

const FLAP_SPEED = -4;
const BIRD_WIDTH = 50;
const BIRD_HEIGHT = 50;
const scaledBirdWidth = 100; 
const scaledBirdHeight = 100; 



const PIPE_WIDTH = 50;
const PIPE_GAP = 125;

let birdX = 50; 
let birdY = 50;
let birdVelocity = 0;
let birdAcceleration = 0.2;

let pipeX= 400;
let pipeY= canvas.height - 200;

let scoreDiv = document.getElementById('score-display');
let score = 0;
let highScore = 0;

let scored = false;

document.body.onkeyup = function(e) {
    if (e.code == 'Space') {
        birdVelocity = FLAP_SPEED;
    }
}

document.getElementById('restart-button').addEventListener('click', function(){ 
    hideEndMenu();
    restGame();
    loop();
})

function increaseScore() {
    if (birdX > pipeX + PIPE_WIDTH &&
        birdX < pipeX + PIPE_WIDTH + 1 && 
        !scored) {
        score++;
        scoreDiv.innerHTML = score;
        scored = true;
    }
    if (birdX < pipeX + PIPE_WIDTH) {
        scored = false;
    }
}

function collisionCheck() {
    const birdBox = {
        x: birdX,
        y: birdY,
        width: BIRD_WIDTH,
        height: BIRD_HEIGHT
    }

    const topPipeBox = {
        x: pipeX,
        y: 0,
        width: PIPE_WIDTH,
        height: pipeY - PIPE_GAP
    }

    const bottomPipeBox = {
        x: pipeX,
        y: pipeY + PIPE_GAP,
        width: PIPE_WIDTH,
        height: canvas.height - pipeY - PIPE_GAP
    }

    if (birdBox.x < topPipeBox.x + topPipeBox.width &&
        birdBox.x + birdBox.width > topPipeBox.x &&
        birdBox.y < topPipeBox.y + topPipeBox.height &&
        birdBox.y + birdBox.height > topPipeBox.y) {
        return true;
    }

    if (birdBox.x < bottomPipeBox.x + bottomPipeBox.width &&
        birdBox.x + birdBox.width > bottomPipeBox.x &&
        birdBox.y < bottomPipeBox.y + bottomPipeBox.height &&
        birdBox.y + birdBox.height > bottomPipeBox.y) {
        return true;
    }

    if (birdY < 0 || birdY + BIRD_HEIGHT > canvas.height) {
        return true;
    }

    return false;
}
function hideEndMenu () {
    document.getElementById('end-menu').style.display = 'none';
    gameContainer.classList.remove('backdrop-blur');
}

function showEndMenu () {
    document.getElementById('end-menu').style.display = 'block';
    gameContainer.classList.add('backdrop-blur');
    document.getElementById('end-score').innerHTML = score;

    if (highScore < score) {
        highScore = score;
    }
    document.getElementById('best-score').innerHTML = highScore;
}

function restGame (){
    birdX = 50; 
    birdY = 50;
    birdVelocity = 0;
    birdAcceleration = 0.1;

    pipeX = 400;
    pipeY = canvas.height - 200;

    score = 0;
}

function endGame (){
    showEndMenu();
}

function loop() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);
    ctx.drawImage(fImg, birdX, birdY, scaledBirdWidth, scaledBirdHeight);
    
    ctx.fillStyle = '#15ff00';
    ctx.fillRect(pipeX, 0, PIPE_WIDTH, pipeY - PIPE_GAP); 
    ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY - PIPE_GAP); 

    if (collisionCheck()){
        endGame();
        return;
    }

    pipeX -= 1.5;
    if (pipeX < -PIPE_WIDTH) { 
        pipeX = 400;
        pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
    }

    birdVelocity += birdAcceleration;
    birdY += birdVelocity;
    increaseScore();
    requestAnimationFrame(loop);
}