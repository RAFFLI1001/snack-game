const canvas = document.getElementById('snakecanvas');
        const ctx = canvas.getContext('2d');
        const gridsize = 20;
        const canvasSize = canvas.width / gridsize; // Assuming square grid
        let snake = [{ x: 10, y: 10 }];
        let food = getRandomFood();
        let score = 0;
        let highScore = localStorage.getItem('highScore') || 0; // Initialize high score from localStorage
        let speed = 50;
        let initialSpeed = speed;
        let direction = 'right';
    
        // Update high score display when the page loads
        document.querySelector('#high-score span').innerText = highScore;
    
        function drawSnake() {
            snake.forEach((segment, index) => {
                ctx.fillStyle = index === 0 ? '#ff4081' : '#fff';
                ctx.shadowBlur = index === 0 ? 10 : 0;
                ctx.shadowColor = 'ff4081';
                ctx.fillRect(segment.x * gridsize, segment.y * gridsize, gridsize, gridsize);
                ctx.shadowColor = 'transparent';
            });
        }
    
        function drawFood() {
            ctx.fillStyle = '#fff';
            ctx.fillRect(food.x * gridsize, food.y * gridsize, gridsize, gridsize);
        }
    
        function getRandomFood() {
            return {
                x: Math.floor(Math.random() * canvasSize),
                y: Math.floor(Math.random() * canvasSize),
            };
        }
    
        function moveSnake() {
            const head = { ...snake[0] };
    
            switch (direction) {
                case 'up':
                    head.y = (head.y - 1 + canvasSize) % canvasSize;
                    break;
                case 'down':
                    head.y = (head.y + 1) % canvasSize;
                    break;
                case 'left':
                    head.x = (head.x - 1 + canvasSize) % canvasSize;
                    break;
                case 'right':
                    head.x = (head.x + 1) % canvasSize;
                    break;
            }
    
            snake.unshift(head);
    
            if (head.x === food.x && head.y === food.y) {
                food = getRandomFood();
                score++;
                updateScore();
                increaseSpeed();
            } else {
                snake.pop();
            }
        }
    
        function checkCollision() {
            const head = snake[0];
            return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
        }
    
        function increaseSpeed() {
            speed = Math.max(50, initialSpeed - Math.floor(score / 5) * 5);
        }
    
        function updateScore() {
            const scoreElement = document.querySelector('#score span');
            scoreElement.innerText = score;
        }
    
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
    
            if (checkCollision()) {
                resetGame();
            }
    
            drawSnake();
            drawFood();
    
            ctx.fillStyle = '#fff';
            ctx.font = '20px Arial';
            ctx.fillText(`score: ${score}`, 10, 25);
        }
    
        function resetGame() {
            // Update high score if current score is greater than high score
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('highScore', highScore); // Save new high score to localStorage
                document.querySelector('#high-score span').innerText = highScore;
            }
    
            alert(`Game Over! Nilai Anda: ${score}`);
            snake = [{ x: 10, y: 10 }];
            direction = 'right';
            food = getRandomFood();
            score = 0;
            speed = initialSpeed;
            updateScore();
        }
    
        function gameLoop() {
            moveSnake();
            draw();
            setTimeout(gameLoop, speed);
        }
    
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'w':
                case 'W':
                    if (direction !== 'down') direction = 'up';
                    break;
                case 's':
                case 'S':
                    if (direction !== 'up') direction = 'down';
                    break;
                case 'a':
                case 'A':
                    if (direction !== 'right') direction = 'left';
                    break;
                case 'd':
                case 'D':
                    if (direction !== 'left') direction = 'right';
                    break;
            }
        });
    
        gameLoop();