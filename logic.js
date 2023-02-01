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
    let enemyId

    //define the enemies TODO: make this an object later to be imported, with multiple sets of enemies
    const enemies = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39
    ]
    
    //draw the enemies on the board
    enemies.forEach(enemy => blocks[currentEnemyIndex + enemy].classList.add('enemy'))

    //draw user spaceship 
    blocks[currentSpaceshipIndex].classList.add('spacecraft')

    //make the spaceship left to right
    function maneuverSpaceship(event) {
        blocks[currentSpaceshipIndex].classList.remove('spacecraft')
        switch(event.keyCode) {
            //left and right
            case 37:
                if(currentSpaceshipIndex % width !== 0) currentSpaceshipIndex -=1
                break
            case 39:
                if(currentSpaceshipIndex % width < width - 1) currentSpaceshipIndex +=1
                break

            //up and down TODO: Add up and down functionality
            case 38:
                if(currentSpaceshipIndex >= height + 1) currentSpaceshipIndex -=15
                break
            case 40:
                if(currentSpaceshipIndex <= height * 15 - 16) currentSpaceshipIndex +=15
        }

        blocks[currentSpaceshipIndex].classList.add('spacecraft')
    }

    //listen for keys being pressed to move the spaceship
    document.addEventListener('keydown', maneuverSpaceship)
})