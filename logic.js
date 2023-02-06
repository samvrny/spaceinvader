document.addEventListener('DOMContentLoaded', () => {

    //initializing the game
    const blocks = document.querySelectorAll('.grid div');
    const scoreDisplay = document.getElementById('result');

    let width = 15;
    let height = 15;
    let currentSpaceshipIndex = 202;
    let currentEnemyIndex = 0;
    let enemiesKilled = [];
    let score = 0;
    let direction = 1;
    let enemyId;

    //define the enemies TODO: make this an object later to be imported, with multiple sets of enemies
    const enemies = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39
    ];

    //draw the enemies on the board
    enemies.forEach(enemy => blocks[currentEnemyIndex + enemy].classList.add('enemy'));

    //draw user spaceship 
    blocks[currentSpaceshipIndex].classList.add('spacecraft');

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
            blocks[enemies[i]].classList.add('enemy');
        }

        //if the spaceship runs into an enemy, the game is over
        if (blocks[currentSpaceshipIndex].classList.contains('enemy', 'spacecraft')) {
            scoreDisplay.textContent = 'You were killed!';
            blocks[currentSpaceshipIndex].classList.add('shot');
            clearInterval(enemyId);
        }

        //if the enemies reach the bottom of the board, the game is over
        for (let i = 0; i <= enemies.length - 1; i++) {
            if (enemies[i] > (blocks.length - (width - 1))) {
                scoreDisplay.textContent = 'Your spacecraft was destroyed!';
                clearInterval(enemyId);
            }
        }
    }

    //let the users spacecraft fire
    function fire(e) {
        let bulletId;
        let currentBulletIndex = currentSpaceshipIndex;

        moveBullet = () => {
            blocks[currentBulletIndex].classList.remove('bullet');
            currentBulletIndex -= width;
            blocks[currentBulletIndex].classList.add('bullet');

            if (blocks[currentBulletIndex].contains('enemy')) {
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
        document.addEventListener('keyup', e => {
            if (e.keyCode === 32) {
                bulletId = setInterval(moveBullet, 100)
            }
        })

    }

    enemyId = setInterval(moveEnemies, 500)

    document.addEventListener('keyup', fire)

    //listen for keys being pressed to move the spaceship
    document.addEventListener('keydown', maneuverSpaceship)
})