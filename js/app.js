var Item = function(x, y, speed, sprite) {
  this.x = x;
  this.y = y;
  this.speed = speed;
  this.sprite = sprite;
}

Item.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Inimigos que o jogador deve evitar
var Enemy = function(x, y, speed) {
    Item.call(this, x, y, speed, 'images/enemy-bug.png');
};

Enemy.prototype = Object.create(Item.prototype);
Enemy.prototype.constructor = Enemy;

// Atualiza a posição dos inimigos na tela, levando em conta sua velocidade
Enemy.prototype.update = function(dt) {
  this.x += this.speed * dt;
  this.checkCollisions();
  calculateAddEnemy();
}

// Verifica se o inimigo colidiu com o personagem
Enemy.prototype.checkCollisions = function () {
  if (player.x >= this.x - 70 &&
      player.x <= this.x + 70 &&
      player.y == this.y) {
    player.x = 202;
    player.y = 380;

    level = 1;
    numEnemies = 2;

    allEnemies = [];
    calculateAddEnemy();
  }

  if (this.x >= 500) {
    this.y = calculateEnemyY();
    this.x = 0;
    this.speed = calculateEnemySpeed();
  }
};

// Jogador
var Player = function(x, y, speed) {
  Item.call(this, x, y, speed, 'images/char-boy.png');
}

Player.prototype = Object.create(Item.prototype);
Player.prototype.constructor = Player;

// Atualiza o jogador
Player.prototype.update = function(dt) {
  this.checkWin();
};

// Atualiza a posição do jogador de acordo com o botão clicado
Player.prototype.handleInput = function(key) {
  switch(key) {
    case 'up':
      this.y -= this.speed - 20;
      break;
    case 'down':
      this.y += this.speed - 20;
      break;
    case 'left':
      this.x -= this.speed;
      break;
    case 'right':
      this.x += this.speed;
      break;
    default:
      break;
  };
};

// Verifica se o jogador venceu o jogo chegando na água
// Verifica também os limites da tela, para que o jogador não saia dela
Player.prototype.checkWin = function() {
  if (player.y <= 0) {
    player.x = 202;
    player.y = 380;

    level++;
    numEnemies++;
  }

  if (player.y > 380) {
    player.y = 380;
  }

  if (player.x < 2) {
    player.x = 2;
  }

  if (player.x > 402) {
    player.x = 402;
  }
};

// Calcula aleatóriamente a posição do inimigo no eixo y
var calculateEnemyY = function() {
  var y = Math.floor(Math.random() * -3 + 1) * -1;

  if (y == 1) {
    return 60;
  } else if (y == 2) {
    return 140;
  } else {
    return 220;
  }
}

// Calcula aleatóriamente a velocidade do inimigo
var calculateEnemySpeed = function() {
  var speed = Math.floor(Math.random() * 500 );

  if (speed < 50) {
    speed = 50;
  }

  return speed;
}

// Adiciona um novo inimigo na tela
var addEnemy = function() {
  allEnemies.push(new Enemy(0, calculateEnemyY(), calculateEnemySpeed()));
}

// Adiciona, se possível, um novo inimigo na tela, mantendo o número de Inimigos
// condizente com o nível atingido
var calculateAddEnemy = function() {
  if (allEnemies.length < numEnemies) {
    addEnemy();
  }
}

var allEnemies = [];
var player = new Player(202, 380, 100);
var level = 1;
var numEnemies = 2;

calculateAddEnemy();

// Evento para verificar as teclas pressionadas
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
