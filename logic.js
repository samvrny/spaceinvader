document.addEventListener('DOMContentLoaded', () => {

    //initializing the game by getting all the needed DOM elements together
    const blocks = document.querySelectorAll('.grid div');
    const scoreDisplay = document.getElementById('result');
    const playAgain = document.getElementById('play-again')

    playAgain.textContent = 'Start Game'

    //declaring global variables
    let width;
    let height;
    let currentSpaceshipIndex;
    let currentEnemyIndex;
    let enemiesKilled;
    let score;
    let direction;
    let enemyId;
    let enemies;
    let currentEnemyList;

    //function to start and restart the game
    function startGameOver() {
        playAgain.textContent = 'Play Again'

        //starts or resets the game
        currentSpaceshipIndex = 202;
        currentEnemyList = 0;
        clearInterval(enemyId);

        //reset the score
        score = 0;
        scoreDisplay.textContent = score;

        //listening for the keys to move and fire the spacecraft
        document.addEventListener('keyup', fire);
        document.addEventListener('keydown', maneuverSpaceship);
        playAgain.blur();

        setUpBoard()
    }

    //listens for the game to be started
    playAgain.addEventListener('click', startGameOver)

    function setUpBoard() {

        //if there are no more sets of enemies to use, the game is over
        if (currentEnemyList > 3) {
            scoreDisplay.textContent = 'Youve won the game!'
            clearInterval(enemyId);
            return;
        }

        //clears the game board from former game
        clearInterval(enemyId);
        blocks.forEach(block => block.classList.remove('enemy', 'spacecraft', 'shot'));

        //resets the enemy info so the new group of enemies can be set to the board
        width = 15;
        height = 15;
        currentEnemyIndex = 0;
        enemiesKilled = [];
        direction = 1;

        //lists different sets of enemies to be used in the game
        enemiesToUse = [
            //sets of 9 start at the zero working in 15s (0,15,30, etc) and go to 9(9,24,39, etc)
            [
                0,2,4,6,8,16,18,20,22,30,32,34,36,38
            ],
            [
                0,1,2,3,4,5,6,7,8,9,30,31,32,33,34,35,36,37,38,39,60,61,62,63,64,65,66,67,68,69
            ],
            [
                0,1,2,3,4,5,6,7,8,9,15,16,17,18,19,20,
                21,22,23,24,30,31,32,33,34,35,36,37,38,39
            ],
            [
                0,3,6,9,17,20,23,31,36,38,45,48,51,54
            ]
        ]

        //checks and uses the current set of enemies
        enemies = enemiesToUse[currentEnemyList]

        //draw the enemies on the board
        enemies.forEach(enemy => blocks[currentEnemyIndex + enemy].classList.add('enemy'));

        //draw user spaceship 
        blocks[currentSpaceshipIndex].classList.add('spacecraft');
        enemyId = setInterval(moveEnemies, 500);
    }

    //make the spaceship left to right
    function maneuverSpaceship(event) {
        blocks[currentSpaceshipIndex].classList.remove('spacecraft');
        switch (event.keyCode) {

            //left and right
            case 37:
                if (currentSpaceshipIndex % width !== 0) currentSpaceshipIndex -= 1
                break
            case 39:
                if (currentSpaceshipIndex % width < width - 1) currentSpaceshipIndex += 1
                break

            //up and down
            case 38:
                if (currentSpaceshipIndex >= height + 1) currentSpaceshipIndex -= 15
                break
            case 40:
                if (currentSpaceshipIndex <= height * 15 - 16) currentSpaceshipIndex += 15
        }

        blocks[currentSpaceshipIndex].classList.add('spacecraft');
    }

    //moves the enemies
    function moveEnemies() {
        //check if the first and last enemies in the enemies array are hitting the right or left edge, respectively.
        const leftEdge = enemies[0] % width === 0;
        const rightEdge = enemies[enemies.length - 1] % width === width - 1;

        if ((leftEdge && direction === -1) || (rightEdge && direction === 1)) {
            direction = width;
        } else if (direction === width) {
            if (leftEdge) direction = 1;
            else direction = -1;
        }

        for (let i = 0; i <= enemies.length - 1; i++) {
            blocks[enemies[i]].classList.remove('enemy');
        }

        for (let i = 0; i <= enemies.length - 1; i++) {
            enemies[i] += direction;
        }

        for (let i = 0; i <= enemies.length - 1; i++) {
            if (!enemiesKilled.includes(i)) {
                blocks[enemies[i]].classList.add('enemy');
            }
        }

        //if the spaceship runs into an enemy, the game is over
        if (blocks[currentSpaceshipIndex].classList.contains('enemy', 'spacecraft')) {
            scoreDisplay.textContent = 'Your spacecraft was destroyed!';
            blocks[currentSpaceshipIndex].classList.add('shot');
            clearInterval(enemyId);
        }

        //if the enemies reach the bottom of the board, the game is over
        for (let i = 0; i <= enemies.length - 1; i++) {
            if (enemies[i] > (blocks.length - (width - 1))) {
                scoreDisplay.textContent = 'Your base was destroyed!';
                clearInterval(enemyId);
            }
        }

        //see if game is won
        if (enemiesKilled.length === enemies.length) {
            scoreDisplay.textContent = 'Nice Going!'
            currentEnemyList = currentEnemyList + 1;
            setUpBoard()
        } 
    }

    //let the users spacecraft fire
    function fire(e) {
        let bulletId;
        let currentBulletIndex = currentSpaceshipIndex;

        function moveBullet() {
            blocks[currentBulletIndex].classList.remove('bullet');
            currentBulletIndex -= width;
            blocks[currentBulletIndex].classList.add('bullet');

            if (blocks[currentBulletIndex].classList.contains('enemy')) {
                blocks[currentBulletIndex].classList.remove('bullet');
                blocks[currentBulletIndex].classList.remove('enemy');
                blocks[currentBulletIndex].classList.add('shot');

                setTimeout(() => blocks[currentBulletIndex].classList.remove('shot'), 250);
                clearInterval(bulletId);

                const killedEnemy = enemies.indexOf(currentBulletIndex);
                enemiesKilled.push(killedEnemy);
                score++;
                scoreDisplay.textContent = score;
            }

            if (currentBulletIndex < width) {
                clearInterval(bulletId)
                setTimeout(() => blocks[currentBulletIndex].classList.remove('bullet'), 100)
            }
        }

        //listen for the user to 'fire' the spacecrafts weapons
        switch (e.keyCode) {
            case 32:
                bulletId = setInterval(moveBullet, 100)
                break
        }
    }

})