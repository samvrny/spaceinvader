document.addEventListener('DOMContentLoaded', () => {

    //initializing the game
    const blocks = document.querySelectorAll('.grid div');
    const scoreDisplay = document.getElementById('result');

    let width = 15;
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

})