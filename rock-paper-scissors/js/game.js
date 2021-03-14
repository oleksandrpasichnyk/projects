const resultField = document.querySelector('.result-field');
const player1ImgContainer = document.querySelector('.player1-img-container');
const player2ImgContainer = document.querySelector('.player2-img-container');

const roles = ['Scissors', 'Paper', 'Rock'];
let isStarted = false;

const gameData = {
    round: 0,
    player1wins: 0,
    player2wins: 0,
};

const startGame = () => {
    resultField.textContent = '';
    player1ImgContainer.textContent = '';
    player2ImgContainer.textContent = '';
    gameData.round = 0;
    gameData.player1wins = 0;
    gameData.player2wins = 0;
    isStarted = true;
};

const playRound = (role1) => {
    gameData.round++;
    const role2 = getRandomRole();

    const role1Img = createRoleImg(role1);
    player1ImgContainer.textContent = '';
    player1ImgContainer.append(role1Img);

    const role2Img = createRoleImg(role2);
    role2Img.classList.add('reversed');
    player2ImgContainer.textContent = '';
    player2ImgContainer.append(role2Img);

    const roundResult = compareRoles(role1, role2);
    switch (roundResult) {
    case 'player 1':
        gameData.player1wins++;
        resultField.innerHTML += `<p>Round ${gameData.round}, ${role1} vs. ${role2}, You’ve WON!</p>`;
        break;
    case 'player 2':
        gameData.player2wins++;
        resultField.innerHTML += `<p>Round ${gameData.round}, ${role1} vs. ${role2}, You’ve LOST!</p>`;
        break;
    case 'draw':

        break;

    default:
        break;
    }
    if (gameData.player1wins === 3 || gameData.player2wins === 3) {
        const winner = gameData.player1wins === 3 ? 'YOU' : 'COMPUTER';
        resultField.textContent = '';
        resultField.innerHTML = `<p>${winner} won this game!</p>`;
        finishGame();
    }
};

const getRandomRole = () => roles[Math.floor(Math.random() * 3)];

const createRoleImg = (role) => {
    const img = document.createElement('img');
    img.src = `/img/${role.toLowerCase()}.png`;
    img.alt = role;
    img.classList.add('role-img');
    return img;
};

const compareRoles = (role1, role2) => {
    if (role1 === role2) return 'draw';
    const index1 = roles.indexOf(role1);
    const index2 = roles.indexOf(role2);
    if (index2 - index1 === 1 || index2 - index1 === -2) return 'player 1';
    return 'player 2';
};

const finishGame = () => {
    isStarted = false;
    gameData.round = 0;
    gameData.player1wins = 0;
    gameData.player2wins = 0;
};

const resetGame = () => {
    resultField.textContent = '';
    finishGame();
    player1ImgContainer.textContent = '';
    player2ImgContainer.textContent = '';
};

export {startGame, playRound, resetGame, isStarted};