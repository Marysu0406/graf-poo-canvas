// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Variables de puntuación
let scorePlayer = 0;
let scoreAI = 0;

// Colores disponibles para las pelotas
const ballColors = ['red', 'blue', 'yellow', 'cyan', 'purple'];

// Clase Ball (Pelota)
class Ball {
    constructor(x, y, radius, speedX, speedY, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
    move() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Rebote en los bordes superior e inferior
        if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
            this.speedY = -this.speedY;
        }
        
        // Si la pelota sale del marco, reaparece dentro
        if (this.x - this.radius <= 0 || this.x + this.radius >= canvas.width) {
            this.x = canvas.width / 2;
            this.y = canvas.height / 2;
            this.speedX = (Math.random() * 4) + 2 * (Math.random() < 0.5 ? 1 : -1);
            this.speedY = (Math.random() * 4) + 2 * (Math.random() < 0.5 ? 1 : -1);
        }
    }
}

// Clase Paddle (Paleta)
class Paddle {
    constructor(x, y, width, height, color, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = speed;
        this.direction = 1; // Para mantener movimiento constante arriba y abajo
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    move(direction) {
        if (direction === 'up' && this.y > 0) {
            this.y -= this.speed;
        } else if (direction === 'down' && this.y + this.height < canvas.height) {
            this.y += this.speed;
        }
    }
    autoMoveConstant() {
        this.y += this.speed * this.direction;

        if (this.y <= 0 || this.y + this.height >= canvas.height) {
            this.direction *= -1; // Cambia de dirección al tocar los bordes
        }
    }
}

// Clase Game (Controla el juego)
class Game {
    constructor() {
        this.balls = [];
        this.initBalls();
        this.paddle1 = new Paddle(0, canvas.height / 2 - 120, 10, 240, 'green', .7); // Paleta verde aún más lenta
        this.paddle2 = new Paddle(canvas.width - 10, canvas.height / 2 - 30, 10, 100, 'red', .8); // Paleta roja un poco más lenta
        this.keys = {};
    }
    initBalls() {
        this.balls = [];
        for (let i = 0; i < 5; i++) {
            let radius = Math.random() < 0.5 ? Math.floor(Math.random() * 5) + 3 : Math.floor(Math.random() * 15) + 10;
            let color = ballColors[i % ballColors.length];
            this.balls.push(new Ball(
                canvas.width / 2, 
                canvas.height / 2, 
                radius, 
                (Math.random() * 4) + 2 * (Math.random() < 0.5 ? 1 : -1), 
                (Math.random() * 4) + 2 * (Math.random() < 0.5 ? 1 : -1), 
                color
            ));
        }
    }
    draw() {
        ctx.fillStyle = '#333';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        this.balls.forEach(ball => ball.draw());
        this.paddle1.draw();
        this.paddle2.draw();
    }
    update() {
        this.balls.forEach(ball => {
            ball.move();

            if (this.keys['ArrowUp']) this.paddle1.move('up');
            if (this.keys['ArrowDown']) this.paddle1.move('down');

            this.paddle2.autoMoveConstant(); // Paleta roja en movimiento constante

            // Colisión con las paletas
            if (
                ball.x - ball.radius <= this.paddle1.x + this.paddle1.width &&
                ball.y >= this.paddle1.y &&
                ball.y <= this.paddle1.y + this.paddle1.height
            ) {
                ball.speedX = -ball.speedX;
            }
            if (
                ball.x + ball.radius >= this.paddle2.x &&
                ball.y >= this.paddle2.y &&
                ball.y <= this.paddle2.y + this.paddle2.height
            ) {
                ball.speedX = -ball.speedX;
            }
        });
    }
    handleInput() {
        window.addEventListener('keydown', (event) => {
            this.keys[event.key] = true;
        });
        window.addEventListener('keyup', (event) => {
            this.keys[event.key] = false;
        });
    }
    run() {
        this.handleInput();
        const gameLoop = () => {
            this.update();
            this.draw();
            requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }
}

const game = new Game();
game.run();
