const canvas = document.querySelector('#game');
const context = canvas.getContext('2d');

const world = {
  width: canvas.width,
  height: canvas.height,
  gravity: 1400,
  moveSpeed: 260,
  jumpSpeed: 520,
};

const spawnPoint = { x: 64, y: 300 };
const maxDeaths = 3;
const player = {
  x: spawnPoint.x,
  y: spawnPoint.y,
  width: 28,
  height: 36,
  velocityX: 0,
  velocityY: 0,
  onGround: false,
};

const platforms = [];
const previousRunLayouts = new Map();
const currentRunLayouts = new Map();

const keys = new Set();
const jumpKeys = new Set(['Space', 'ArrowUp', 'KeyW']);
let previousTime = 0;
let isDead = false;
let deathCount = 0;
let isLevelComplete = false;
let levelTransitionTimer = 0;
let levelNumber = 1;
let goal;
let runSeed = createRunSeed();

window.addEventListener('keydown', (event) => {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'Space'].includes(event.code)) {
    event.preventDefault();
  }

  if (event.repeat) return;

  if (isDead) {
    if (event.code === 'KeyR') {
      if (deathCount >= maxDeaths) restartGame();
      else restartLevel();
    }
    return;
  }

  const isNewPress = !keys.has(event.code);
  keys.add(event.code);

  if (isNewPress && jumpKeys.has(event.code) && player.onGround) {
    player.velocityY = -world.jumpSpeed;
    player.onGround = false;
  }
});

window.addEventListener('keyup', (event) => {
  keys.delete(event.code);
});

function clearKeys() {
  keys.clear();
}

window.addEventListener('blur', clearKeys);
window.addEventListener('focus', clearKeys);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) clearKeys();
});

function overlaps(first, second) {
  return first.x < second.x + second.width
    && first.x + first.width > second.x
    && first.y < second.y + second.height
    && first.y + first.height > second.y;
}

function createRunSeed() {
  return (Date.now() ^ Math.floor(Math.random() * 0x100000000)) >>> 0;
}

function createRandom(seed) {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6D2B79F5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 0x100000000;
  };
}

function randomInt(random, minimum, maximum) {
  return Math.floor(random() * (maximum - minimum + 1)) + minimum;
}

function generatePlatforms(seed) {
  const random = createRandom(seed);
  const generated = [
    { x: 0, y: 408, width: randomInt(random, 136, 152), height: 42 },
  ];

  while (generated[generated.length - 1].x + generated[generated.length - 1].width < world.width - 180) {
    const previous = generated[generated.length - 1];
    const x = previous.x + previous.width + randomInt(random, 36, 56);
    const width = Math.min(randomInt(random, 108, 136), world.width - 24 - x);
    const minimumY = Math.max(318, previous.y - 48);
    const maximumY = Math.min(380, previous.y + 48);

    generated.push({
      x,
      y: randomInt(random, minimumY, maximumY),
      width,
      height: 18,
    });
  }

  return generated;
}

function getLayoutSignature(layout) {
  return layout.map(({ x, y, width, height }) => `${x},${y},${width},${height}`).join('|');
}

function createLevelLayout(number) {
  const previousSignature = previousRunLayouts.get(number);
  const currentSignatures = new Set(currentRunLayouts.values());
  let generated;
  let signature;
  let attempt = 0;

  do {
    const seed = (runSeed + Math.imul(number, 0x9e3779b9) + attempt) >>> 0;
    generated = generatePlatforms(seed);
    signature = getLayoutSignature(generated);
    attempt += 1;
  } while (signature === previousSignature || currentSignatures.has(signature));

  currentRunLayouts.set(number, signature);
  const lastPlatform = generated[generated.length - 1];

  return {
    platforms: generated,
    goal: {
      x: lastPlatform.x + lastPlatform.width - 28,
      y: lastPlatform.y - 42,
      width: 24,
      height: 42,
    },
  };
}

function loadLevel(number) {
  levelNumber = number;
  const level = createLevelLayout(number);
  platforms.splice(0, platforms.length, ...level.platforms);
  goal = level.goal;
  player.x = spawnPoint.x;
  player.y = spawnPoint.y;
  player.velocityX = 0;
  player.velocityY = 0;
  player.onGround = false;
  isDead = false;
  isLevelComplete = false;
  levelTransitionTimer = 0;
  keys.clear();
}

function movePlayer(deltaTime) {
  const movingLeft = keys.has('ArrowLeft') || keys.has('KeyA');
  const movingRight = keys.has('ArrowRight') || keys.has('KeyD');
  player.velocityX = Number(movingRight) - Number(movingLeft);

  player.x += player.velocityX * world.moveSpeed * deltaTime;
  for (const platform of platforms) {
    if (!overlaps(player, platform)) continue;
    if (player.velocityX > 0) player.x = platform.x - player.width;
    if (player.velocityX < 0) player.x = platform.x + platform.width;
  }

  player.velocityY += world.gravity * deltaTime;
  const previousTop = player.y;
  const previousBottom = player.y + player.height;
  player.y += player.velocityY * deltaTime;
  player.onGround = false;

  for (const platform of platforms) {
    const overlapsHorizontally = player.x < platform.x + platform.width
      && player.x + player.width > platform.x;
    if (!overlapsHorizontally) continue;

    if (player.velocityY > 0 && previousBottom <= platform.y && player.y + player.height >= platform.y) {
      player.y = platform.y - player.height;
      player.velocityY = 0;
      player.onGround = true;
    } else if (player.velocityY < 0 && previousTop >= platform.y + platform.height && player.y <= platform.y + platform.height) {
      player.y = platform.y + platform.height;
      player.velocityY = 0;
    }
  }
}

function drawBackground() {
  context.fillStyle = '#9dd7c2';
  context.fillRect(0, 0, world.width, world.height);

  context.fillStyle = '#bce4cb';
  context.fillRect(0, 300, world.width, 108);

  context.fillStyle = '#f2c14e';
  context.fillRect(680, 54, 38, 38);
  context.fillStyle = '#ffe08a';
  context.fillRect(688, 46, 22, 8);
  context.fillRect(718, 62, 8, 22);
}

function drawPlatforms() {
  for (const platform of platforms) {
    context.fillStyle = '#47765c';
    context.fillRect(platform.x, platform.y, platform.width, platform.height);
    context.fillStyle = '#78a66c';
    context.fillRect(platform.x, platform.y, platform.width, 5);
    context.fillStyle = '#365d4c';
    context.fillRect(platform.x, platform.y + platform.height - 4, platform.width, 4);
  }
}

function drawGoal() {
  context.fillStyle = '#263e54';
  context.fillRect(goal.x + 2, goal.y, 4, goal.height);
  context.fillStyle = '#e87552';
  context.beginPath();
  context.moveTo(goal.x + 6, goal.y + 2);
  context.lineTo(goal.x + 25, goal.y + 10);
  context.lineTo(goal.x + 6, goal.y + 19);
  context.closePath();
  context.fill();
  context.fillStyle = '#f2c14e';
  context.fillRect(goal.x - 3, goal.y + goal.height - 3, 14, 3);
}

function drawPlayer() {
  context.fillStyle = '#263e54';
  context.fillRect(player.x, player.y, player.width, player.height);
  context.fillStyle = '#f3f1dc';
  context.fillRect(player.x + 17, player.y + 8, 5, 6);
  context.fillStyle = '#e87552';
  context.fillRect(player.x + 4, player.y + player.height - 5, 8, 5);
  context.fillRect(player.x + 17, player.y + player.height - 5, 8, 5);
}

function die() {
  isDead = true;
  deathCount += 1;
  player.velocityX = 0;
  player.velocityY = 0;
  keys.clear();
}

function restartLevel() {
  player.x = spawnPoint.x;
  player.y = spawnPoint.y;
  player.velocityX = 0;
  player.velocityY = 0;
  player.onGround = false;
  isDead = false;
  keys.clear();
}

function restartGame() {
  for (const [number, signature] of currentRunLayouts) {
    previousRunLayouts.set(number, signature);
  }
  currentRunLayouts.clear();
  runSeed = createRunSeed();
  deathCount = 0;
  loadLevel(1);
}

function draw() {
  drawBackground();
  drawPlatforms();
  drawGoal();
  drawPlayer();

  context.textAlign = 'start';
  context.fillStyle = '#263e54';
  context.font = '16px monospace';
  context.fillText(`LEVEL ${levelNumber}`, 16, 26);
  context.textAlign = 'right';
  context.fillText(`FALLS ${deathCount} / ${maxDeaths}`, world.width - 16, 26);

  if (isDead) {
    context.fillStyle = 'rgba(13, 23, 28, 0.82)';
    context.fillRect(0, 0, world.width, world.height);
    context.textAlign = 'center';
    context.fillStyle = '#f3f1dc';
    context.font = 'bold 32px monospace';
    context.fillText(deathCount >= maxDeaths ? 'GAME OVER' : 'YOU FELL', world.width / 2, world.height / 2 - 8);
    context.fillStyle = '#f2c14e';
    context.font = '16px monospace';
    const message = deathCount >= maxDeaths
      ? 'Press R to restart the game'
      : `Deaths: ${deathCount} / ${maxDeaths} - Press R to try again`;
    context.fillText(message, world.width / 2, world.height / 2 + 28);
    context.textAlign = 'start';
  } else if (isLevelComplete) {
    context.fillStyle = 'rgba(13, 23, 28, 0.76)';
    context.fillRect(0, 0, world.width, world.height);
    context.textAlign = 'center';
    context.fillStyle = '#f3f1dc';
    context.font = 'bold 32px monospace';
    context.fillText(`LEVEL ${levelNumber} CLEAR`, world.width / 2, world.height / 2);
    context.textAlign = 'start';
  }
}

function frame(time) {
  const deltaTime = Math.min((time - previousTime) / 1000 || 0, 1 / 30);
  previousTime = time;

  if (!isDead && !isLevelComplete) {
    movePlayer(deltaTime);
    if (player.y > world.height) die();
    else if (overlaps(player, goal)) {
      isLevelComplete = true;
      player.velocityX = 0;
      player.velocityY = 0;
      keys.clear();
    }
  } else if (isLevelComplete) {
    levelTransitionTimer += deltaTime;
    if (levelTransitionTimer >= 0.9) loadLevel(levelNumber + 1);
  }
  draw();
  requestAnimationFrame(frame);
}

loadLevel(levelNumber);
draw();
requestAnimationFrame(frame);