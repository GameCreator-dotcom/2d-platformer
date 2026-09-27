const canvas = document.querySelector('#game');
const context = canvas.getContext('2d');

const world = {
  width: canvas.width,
  height: canvas.height,
  gravity: 1400,
  moveSpeed: 260,
  jumpSpeed: 520,
};

const player = {
  x: 64,
  y: 300,
  width: 28,
  height: 36,
  velocityX: 0,
  velocityY: 0,
  onGround: false,
};

const platforms = [
  { x: 0, y: 408, width: 800, height: 42 },
  { x: 176, y: 332, width: 142, height: 18 },
  { x: 376, y: 270, width: 142, height: 18 },
  { x: 578, y: 326, width: 132, height: 18 },
];

const keys = new Set();
const jumpKeys = new Set(['Space', 'ArrowUp', 'KeyW']);
let previousTime = 0;

window.addEventListener('keydown', (event) => {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'Space'].includes(event.code)) {
    event.preventDefault();
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

window.addEventListener('blur', () => {
  keys.clear();
});

function overlaps(first, second) {
  return first.x < second.x + second.width
    && first.x + first.width > second.x
    && first.y < second.y + second.height
    && first.y + first.height > second.y;
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

function drawPlayer() {
  context.fillStyle = '#263e54';
  context.fillRect(player.x, player.y, player.width, player.height);
  context.fillStyle = '#f3f1dc';
  context.fillRect(player.x + 17, player.y + 8, 5, 6);
  context.fillStyle = '#e87552';
  context.fillRect(player.x + 4, player.y + player.height - 5, 8, 5);
  context.fillRect(player.x + 17, player.y + player.height - 5, 8, 5);
}

function draw() {
  drawBackground();
  drawPlatforms();
  drawPlayer();
}

function frame(time) {
  const deltaTime = Math.min((time - previousTime) / 1000 || 0, 1 / 30);
  previousTime = time;

  movePlayer(deltaTime);
  draw();
  requestAnimationFrame(frame);
}

draw();
requestAnimationFrame(frame);