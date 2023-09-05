const gameMenu = document.querySelector('.mainMenu');
const howToPlay = document.querySelector('.howToPlay');
const gameArea = document.querySelector('.gameArea');

const backBtn = document.querySelector('.backButton');
const startBtn = document.querySelector('.gameStart');
const instructionsBtn = document.querySelector('.gameInstructions');

const quitBtn = document.querySelector('.quitGame');
const restartBtn = document.querySelector('.restartGame');

const board = document.getElementById('spawnArea');
const score = document.querySelector('.playerScore');
const lives = document.querySelector('.playerLives');
const highScore = document.querySelector('.playerHighScore');

//game elemenets (player, bullets, enemies);
const player = document.querySelector('.player');

let playerHighScore = 0;
let playerScore = 0;
let playerLives = 100;
let generateEnemySpawn;

//boolean to start and stop player animation
let isGameRunning = false;

//Game Buttons Menu Listener
startBtn.addEventListener('click', function () {
  gameArea.style.display = 'flex';
  gameMenu.style.display = 'none';
  isGameRunning = true;
  startGame();
  start();
  playGameAudio();
});

instructionsBtn.addEventListener('click', function () {
  gameMenu.style.display = 'none';
  howToPlay.style.display = 'flex';
});

backBtn.addEventListener('click', function () {
  gameMenu.style.display = 'flex';
  howToPlay.style.display = 'none';
});

quitBtn.addEventListener('click', function () {
  gameArea.style.display = 'none';
  gameMenu.style.display = 'flex';
  isGameRunning = false;
  quitGame();
  stopGameAudio();
});

restartBtn.addEventListener('click', function () {
  restartGame();
});

//game start
function startGame() {
  playerHighScore = 0;
  playerScore = 0;
  playerLives = 100;
  score.textContent = '0';
  lives.textContent = '100';
  highScore.textContent = '0';
  gameLoop();
}

//spawn Enemy every 1.5s
function gameLoop() {
  generateEnemySpawn = setInterval(generateEnemy, 1300);
}

//quit game and apply a reset
function quitGame() {
  clearInterval(generateEnemySpawn);
  board.innerHTML = '';
  player.style.bottom = '0px';
  player.style.left = '350px';
  playerPositionLeftRight = fixedPlayerPositionLeftRight;
  playerPositionUpDown = fixedPlayerPositionUpDown;
}

//restart game
function restartGame() {
  clearInterval(generateEnemySpawn);
  board.innerHTML = '';
  player.style.bottom = '0px';
  player.style.left = '350px';
  playerPositionLeftRight = fixedPlayerPositionLeftRight;
  playerPositionUpDown = fixedPlayerPositionUpDown;
  playerLives = 100;
  playerScore = 0;
  score.textContent = '0';
  lives.textContent = '100';
  gameLoop();
}

//pop up function when you lose
const togglePopUp = document.querySelector('.popUpMessage');
const popUpRetryBtn = document.querySelector('.popUpRetry');
const popUpQuitGame = document.querySelector('.popUpQuit');
const popUpScore = document.querySelector('.popUpScore');
const insideGameButtons = document.querySelector('.insideGameButtons');

function clearGame() {
  clearInterval(generateEnemySpawn);
  togglePopUp.style.display = 'flex';
  insideGameButtons.style.display = 'none';
  popUpScore.textContent = `${playerScore}`;
  board.innerHTML = '';
}

popUpRetryBtn.addEventListener('click', function () {
  togglePopUp.style.display = 'none';
  gameArea.style.display = 'flex';
  insideGameButtons.style.display = 'block';
  restartGame();
});

popUpQuitGame.addEventListener('click', function () {
  gameMenu.style.display = 'flex';
  gameArea.style.display = 'none';
  togglePopUp.style.display = 'none';
  insideGameButtons.style.display = 'block';
  quitGame();
  stopGameAudio();
  isGameRunning = false;
});

//function update highScore
function updateHighScore() {
  playerHighScore = playerScore;
  highScore.textContent = playerHighScore;
}

//******************************* */
//          GAME LOGIC
//******************************* */
//for resetting the game and adding a fixed value
const fixedPlayerPositionLeftRight = 350;
const fixedPlayerPositionUpDown = 0;
//setting the player when you start the game in the middle as 350px; and bottom 0;
let playerPositionLeftRight = 350;
let playerPositionUpDown = 0;
let bulletSpeed = 8;
let STEPS = 5;

//global move functions
function moveRight() {
  playerPositionLeftRight += STEPS;
  player.style.left = `${playerPositionLeftRight}px`;
}

function moveLeft() {
  playerPositionLeftRight -= STEPS;
  player.style.left = `${playerPositionLeftRight}px`;
}

function moveUp() {
  playerPositionUpDown += STEPS;
  player.style.bottom = `${playerPositionUpDown}px`;
}

function moveDown() {
  playerPositionUpDown -= STEPS;
  player.style.bottom = `${playerPositionUpDown}px`;
}

//handle multiple keys
const keypressed = [];

const CONTROLS = {
  up: ['ArrowUp', 'KeyW'],
  down: ['ArrowDown', 'KeyS'],
  left: ['ArrowLeft', 'KeyA'],
  right: ['ArrowRight', 'KeyD'],
  space: ['Space'],
};

function handleKeyDown(event) {
  if (!keypressed.includes(event.code)) {
    keypressed.push(event.code);
    console.log(keypressed);
  }
}

function handleKeyUp(event) {
  if (keypressed.includes(event.code)) {
    keypressed.splice(keypressed.indexOf(event.code));
  }
}

//Start our game by moving the character
function start() {
  if (!isGameRunning) return;

  if (
    (keypressed.includes(CONTROLS.up[0]) && playerPositionUpDown <= 543) ||
    (keypressed.includes(CONTROLS.up[1]) && playerPositionUpDown <= 543)
  ) {
    moveUp();
    playerCollision();
    console.log(keypressed);
  }
  if (
    (keypressed.includes(CONTROLS.down[0]) && playerPositionUpDown >= 5) ||
    (keypressed.includes(CONTROLS.down[1]) && playerPositionUpDown >= 5)
  ) {
    moveDown();
    playerCollision();
    console.log(keypressed);
  }
  if (
    (keypressed.includes(CONTROLS.left[0]) && playerPositionLeftRight > 0) ||
    (keypressed.includes(CONTROLS.left[1]) && playerPositionLeftRight > 0)
  ) {
    moveLeft();
    playerCollision();
    player.style.animationName = 'moveLeft';
    console.log(keypressed);
  }
  if (
    (keypressed.includes(CONTROLS.right[0]) &&
      playerPositionLeftRight <= 700) ||
    (keypressed.includes(CONTROLS.right[1]) && playerPositionLeftRight <= 700)
  ) {
    moveRight();
    playerCollision();
    player.style.animationName = 'moveRight';
    console.log(keypressed);
  }
  if (keypressed !== 'ArrowLeft' && keypressed !== 'ArrowRight') {
    player.style.animationName = 'playerIdle';
  }

  requestAnimationFrame(start);
}

start();

//bullet function
function handleShootKeyDown() {
  if (keypressed.includes(CONTROLS.space[0])) {
    //create bullet when spacebar is pressed
    let playerBullet = document.createElement('div');
    playerBullet.classList.add('playerBullet');
    board.appendChild(playerBullet);
    playerBullet.style.left = playerPositionLeftRight + 20 + 'px';
    playerBullet.style.bottom = playerPositionUpDown + 58 + 'px';
    playBulletAudio();

    let bulletMove = setInterval(() => {
      let currentPosition = parseInt(playerBullet.style.bottom);
      playerBullet.style.bottom = currentPosition + bulletSpeed + 'px';

      //if bullet reached top: 0px; it will remove the bullet/clear interval
      //(game height - bullet height) - 5px;
      if (currentPosition > 561) {
        playerBullet.remove();
        clearInterval(bulletMove);
      }

      //bullet collision
      let bulletRect = playerBullet.getBoundingClientRect();
      let enemyOne = document.querySelectorAll('.ship');
      enemyOne.forEach((enemies) => {
        let enemyRect = enemies.getBoundingClientRect();
        //test collision based on hitboxes (box size of bullets and enemy)
        if (
          bulletRect.top <= enemyRect.bottom &&
          bulletRect.bottom >= enemyRect.top &&
          bulletRect.right >= enemyRect.left &&
          bulletRect.left <= enemyRect.right
        ) {
          // collision detected
          playExplosionAudio();
          enemies.remove();
          playerBullet.remove();
          clearInterval(bulletMove);

          playerScore += 200;
          score.textContent = playerScore;

          // create explosion effect
          let explosion = document.createElement('div');
          explosion.classList.add('explosion');

          explosion.style.top = enemies.style.top;
          explosion.style.left = enemies.style.left;
          board.appendChild(explosion);

          // remove explosion after 1 second
          setTimeout(() => {
            explosion.remove();
          }, 1000);
        }
      });
    }, 30);
  }
}

//player collision with enemy
function playerCollision() {
  let playerRect = player.getBoundingClientRect();
  let enemyAll = document.querySelectorAll('.ship');

  //looping through each enemy and getting the box size top bottom left right
  enemyAll.forEach((enemies) => {
    let enemyRect = enemies.getBoundingClientRect();

    //collision comparison to test if player has collided with enemy
    if (
      playerRect.top <= enemyRect.bottom &&
      playerRect.bottom >= enemyRect.top &&
      playerRect.right >= enemyRect.left &&
      playerRect.left <= enemyRect.right
    ) {
      playCollisionAudio();
      enemies.remove();
      // create explosion effect
      let explosion = document.createElement('div');
      explosion.classList.add('explosion');
      let playerHit = document.createElement('div');
      playerHit.classList.add('playerHit');
      playerHit.textContent = `HIT`;

      // console.log(enemies);

      explosion.style.top = enemies.style.top;
      explosion.style.left = enemies.style.left;
      board.appendChild(explosion);
      board.appendChild(playerHit);

      // remove explosion after 1 second
      setTimeout(() => {
        explosion.remove();
        playerHit.remove();
      }, 1000);

      if (playerLives > 10) {
        //deduct lives if collision is detected
        //randomize the damage from 1-4 then multiplied by 2 to generate even number deduction;
        const generateRandomLives = Math.floor(Math.random() * 4) + 1;
        const generateEvenRandom = generateRandomLives * 2;
        playerLives -= generateEvenRandom;
        lives.textContent = playerLives;
      }
      //if lives is less than 10 and greater than 0 change deduction from random 1-10 to fixed 2 every collision
      else if (playerLives <= 10 && playerLives > 0) {
        playerLives -= 2;
        lives.textContent = playerLives;
        //if lives is equal to 0, end the game and show the pop up message
        if (playerLives === 0) {
          lives.textContent = 0;
          clearGame();

          if (playerScore > playerHighScore) {
            updateHighScore();
          }
        }
      }
    }
  });
}

//generating enemies
//object for class that will be used to generate enemies

const listOne = ['enemy1', 'ship'];
const listTwo = ['enemy2', 'ship'];

function generateEnemy() {
  let spawnEnemyOne = document.createElement('div');
  let spawnEnemyTwo = document.createElement('div');

  spawnEnemyOne.classList.add(...listOne);
  spawnEnemyOne.style.left = Math.floor(Math.random() * 298) + 'px';
  spawnEnemyOne.style.top = 0 + 'px';

  spawnEnemyTwo.classList.add(...listTwo);
  spawnEnemyTwo.style.left = Math.floor(Math.random() * 298) + 298 + 'px';
  spawnEnemyTwo.style.top = 0 + 'px';

  //start spawning the enemy inside the game board
  board.appendChild(spawnEnemyOne);
  board.appendChild(spawnEnemyTwo);

  //move enemies down
  function moveEnemies() {
    let currentTopOne = parseInt(spawnEnemyOne.style.top);
    let currentTopTwo = parseInt(spawnEnemyTwo.style.top);

    //if current position of enemy ship (top < 585) move down
    if (currentTopOne < 585 && currentTopTwo < 585) {
      spawnEnemyOne.style.top = currentTopOne + 1 + 'px';
      spawnEnemyTwo.style.top = currentTopTwo + 1 + 'px';
      requestAnimationFrame(moveEnemies); // call moveEnemies() again to continue the animation
      playerCollision(); //call playerCollision function while enemies are moving
    } else {
      // remove the enemy from the game board if enemies went down by 700px
      window.cancelAnimationFrame(moveEnemies);
      spawnEnemyOne.remove();
      spawnEnemyTwo.remove();
    }
  }

  requestAnimationFrame(moveEnemies);
}

//event listeners
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
document.addEventListener('keydown', handleShootKeyDown);

//audio functions
let gameAudio = document.getElementById('battleAudio');
let bulletAudio = document.getElementById('bulletAudio');
let explosionAudio = document.getElementById('explosionAudio');
let collisionAudio = document.getElementById('collisionAudio');

function playGameAudio() {
  gameAudio.loop = true;
  gameAudio.volume = 0.3;
  gameAudio.play();
}

function stopGameAudio() {
  gameAudio.loop = false;
  gameAudio.pause();
}

function playBulletAudio() {
  bulletAudio.volume = 0.5;
  bulletAudio.play();
}

function playExplosionAudio() {
  explosionAudio.play();
}

function playCollisionAudio() {
  collisionAudio.play();
}
