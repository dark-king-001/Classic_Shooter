const svg = document.querySelector('#game');
const scoreElement = document.querySelector('#score');
const highScoreElement = document.querySelector('#highscore');
const instructions = document.querySelector('#instructions');

// Game variables
let score = 0;
let highscore = 0;
let level = 1;
let playerX = svg.clientWidth / 2 - 25;
let playerY = svg.clientHeight - 25;
let isMovingLeft = false;
let isMovingRight = false;
let isShooting = false;
let bullets = [];
let obstacles = [];



// Create player spaceship
const player = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
player.setAttribute('x', playerX);
player.setAttribute('y', playerY);
player.setAttribute('width', 50);
player.setAttribute('height', 30);
player.setAttribute('fill', 'blue');
svg.appendChild(player);

// Create event listeners for left and right arrow keys
document.addEventListener('keydown', (event) => {
  if (event.key === 'a') {
    isMovingLeft = true;
  } else if (event.key === 'd') {
    isMovingRight = true;
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key === 'a') {
    isMovingLeft = false;
  } else if (event.key === 'd') {
    isMovingRight = false;
  }
});


// Create event listener for mouse left-click to shoot
document.addEventListener('mousedown', () => {
    isShooting = true;
  });

  document.addEventListener('mouseup', () => {
    isShooting = false;
  });

function shootBullet() {
  const bullet = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bullet.setAttribute('x', playerX + 22);
  bullet.setAttribute('y', playerY);
  bullet.setAttribute('width', 5);
  bullet.setAttribute('height', 10);
  bullet.setAttribute('fill', 'red');
  svg.appendChild(bullet);
  bullets.push(bullet);
}

function createObstacle() {
  const obstacle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  obstacle.setAttribute('x', Math.random() * 750);
  obstacle.setAttribute('y', 0);
  obstacle.setAttribute('width', 20 + Math.random() * 30);
  obstacle.setAttribute('height', 20 + Math.random() * 30);
  obstacle.setAttribute('fill', 'green');
  svg.appendChild(obstacle);
  obstacles.push(obstacle);
}

function updateGame() {
  let bulletSpeed = 10;
  let playerSpeed = 2;
  let obstacleFallingSpeed = 2;

  // Move the player's spaceship smoothly left or right
  if (isMovingLeft && playerX > 0) {
    playerX -= playerSpeed;
  } else if (isMovingRight && playerX < 750) {
    playerX += playerSpeed;
  }
  if (isShooting){
    isShooting = false;
    shootBullet()
    }

  // Update player's position (x attribute)
  player.setAttribute('x', playerX);

  // Check for level updates
  if (score >= 100 && score < 500) {
    level = 2;
    bulletSpeed = 12
    playerSpeed = 3
    obstacleFallingSpeed = 2
  } else if (score >= 500 && score < 2000) {
    level = 3;
    bulletSpeed = 15
    playerSpeed = 4
    obstacleFallingSpeed = 3
  } else if (score >= 2000 && score < 5000) {
    level = 4;
    bulletSpeed = 15
    playerSpeed = 5
    obstacleFallingSpeed = 4
  } else if (score >= 5000 && score < 15000) {
    level = 5;
    bulletSpeed = 15
    playerSpeed = 5
    obstacleFallingSpeed = 8
  } else if (score >= 15000) {
    level = 5; // Maximum level (Level 5)
    bulletSpeed = 18
    playerSpeed = 6
    obstacleFallingSpeed = 10
  }

  // Update bullets position
  bullets.forEach(bullet => {
    bullet.setAttribute('y', parseFloat(bullet.getAttribute('y')) - bulletSpeed);

    // Check for bullet collisions with obstacles
    obstacles.forEach(obstacle => {
      if (checkCollision(bullet, obstacle)) {
        svg.removeChild(obstacle);
        svg.removeChild(bullet);
        obstacles = obstacles.filter(o => o !== obstacle);
        bullets = bullets.filter(b => b !== bullet);
        score += 10;
        scoreElement.textContent = `Score: ${score}\nLevel: ${level}`;
      }
    });

    // Remove bullets that go out of the screen
    if (parseFloat(bullet.getAttribute('y')) < 0) {
      svg.removeChild(bullet);
      bullets = bullets.filter(b => b !== bullet);
    }
  });

  // Update obstacles position
  obstacles.forEach(obstacle => {
    obstacle.setAttribute('y', parseFloat(obstacle.getAttribute('y')) + obstacleFallingSpeed);

    // Check for collisions with the player
    if (checkCollision(player, obstacle)) {
      // Game over, handle accordingly
      alert('Game Over! Your Score: ' + score);
      resetGame();
    }

    // Remove obstacles that go out of the screen
    if (parseFloat(obstacle.getAttribute('y')) > svg.clientHeight) {
      svg.removeChild(obstacle);
      obstacles = obstacles.filter(o => o !== obstacle);
      score -= 20;
      scoreElement.textContent = `Score: ${score}\nLevel: ${level}`;
    }
  });

  // Update game speed based on level
  const obstacleSpeed = level * 0.5; // Increase the obstacle speed with the level

  // Create new obstacles based on the current game speed
  if (Math.random() < obstacleSpeed / 100) {
    createObstacle();
  }

  requestAnimationFrame(updateGame);
}

// Start the game after a 3-second delay
setTimeout(() => {
  requestAnimationFrame(updateGame);
}, 1000);

// Start the game after a 3-second delay
setTimeout(() => {
  instructions.style.display = 'none'; // Hide instructions
}, 5000);

// Helper function to check for collisions between two SVG elements
function checkCollision(element1, element2) {
  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();

  return !(rect1.right < rect2.left || rect1.left > rect2.right ||
    rect1.bottom < rect2.top || rect1.top > rect2.bottom);
}

// Helper function to reset the game after game over
function resetGame() {
  // Remove all obstacles and bullets from the screen
  obstacles.forEach(obstacle => svg.removeChild(obstacle));
  bullets.forEach(bullet => svg.removeChild(bullet));

  // Clear arrays
  obstacles = [];
  bullets = [];

  // Reset player position and score
  playerX = 375;
  if (score > highscore)
    highscore = score
  score = 0;
  level = 1;
  isMovingLeft = false;
  isMovingRight = false;
  scoreElement.textContent = `Score: ${score}\nLevel: ${level}`;
  highScoreElement.textContent = `high score: ${highscore}`;
}

// Event listener to restart the game after game over
document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    resetGame();
  }
});