import {gameField} from './index.js';

const player1Name = document.querySelector('.player1-name');
const player2Name = document.querySelector('.player2-name');
const player1Score = document.querySelector('.player1-score');
const player2Score = document.querySelector('.player2-score');
const currentPlayerName = document.querySelector('.highlight');
const winnreField = document.querySelector('.winner-field');

const circleImg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>';
const crossImg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/></svg>';

let isStarted = false;

let gameArr = [[null, null, null], [null, null, null], [null, null, null]];

class Player {
  constructor(name, id){
    this.name = name,
    this.id = id,
    this.score = 0
  }
};

let player1 = new Player('Player 1', 1);
let player2 = new Player('Player 2', 2);

const getRandomPlayer = () => Math.random() > 0.5 ? player1 : player2;

const changePlayer = (player) => Object.is(player, player2) ? player1 : player2;

let currentPlayer;

const startGame = () => {
  isStarted = true;
  currentPlayer = getRandomPlayer();
}

const playRound = (cell, row, col) => {
  currentPlayer = changePlayer(currentPlayer);
  currentPlayerName.textContent = currentPlayer.name;
  let img = document.createElement('div');
  img.classList.add('cell-img');
  Object.is(currentPlayer, player1) ? img.innerHTML = circleImg : img.innerHTML = crossImg;
  cell.append(img);
  gameArr[row - 1][col - 1] = currentPlayer.id;
  if(isFinished()){
    hightlightLine(isFinished().array);
    let winner = player1.id === isFinished().id ? player1 : player2;
    winnreField.textContent = `${winner.name} won!`;
    winner.score++;
    renderScores();
  }

  if(gameArr.flat().indexOf(null) === -1){
    winnreField.textContent = 'Draw!';
    player1.score++;
    player2.score++;
    renderScores();
  }
}

const renderScores = () => {
  player1Score.textContent = player1.score;
  player2Score.textContent = player2.score;
}

const isFinished = () => {
  let line = {
    array: [[null, null], [null, null], [null, null]],
    id: 0
  };
  let isLine = false;
  for(let i = 0; i < 3; i++){
    for(let j = 0; j < 3; j++){
      if((gameArr[0][j] === gameArr[1][j] && gameArr[1][j] === gameArr[2][j] && gameArr[0][j] !== null)){
        isLine = true;
        line.array = [[0, j], [1, j], [2, j]];
        line.id = gameArr[0][j];
      }
    }
    if(gameArr[i][0] === gameArr[i][1] && gameArr[i][1] === gameArr[i][2] && gameArr[i][0] !== null){
      isLine = true;
      line.array = [[i, 0], [i, 1], [i, 2]];
      line.id = gameArr[i][0];
    }
  }
  if(gameArr[0][0] === gameArr[1][1] && gameArr[1][1] === gameArr[2][2] && gameArr[0][0] !== null){
    isLine = true;
    line.array = [[0, 0], [1, 1], [2, 2]];
    line.id = gameArr[0][0];
  }
  if(gameArr[0][2] === gameArr[1][1] && gameArr[1][1] === gameArr[2][0] && gameArr[0][2] !== null){
    isLine = true;
    line.array = [[0, 2], [1, 1], [2, 0]];
    line.id = gameArr[0][2];
  }
  return isLine ? line : false;
}

const hightlightLine = (lineArray) => {
  for(let i = 0; i < 3; i++){
    let el = document.querySelector(`[data-row="${lineArray[i][0] + 1}"][data-col="${lineArray[i][1] + 1}"]`)
    el.classList.add('highlighted-td');
  }
};

const clearGrid = () => {
  gameField.innerHTML = `
  <tr>
    <td data-row="1" data-col="1"></td>
    <td data-row="1" data-col="2"></td>
    <td data-row="1" data-col="3"></td>
  </tr>
  <tr>
    <td data-row="2" data-col="1"></td>
    <td data-row="2" data-col="2"></td>
    <td data-row="2" data-col="3"></td>
  </tr>
  <tr>
    <td data-row="3" data-col="1"></td>
    <td data-row="3" data-col="2"></td>
    <td data-row="3" data-col="3"></td>
  </tr>
  `;
  currentPlayerName.textContent = '';
  winnreField.textContent = '';
  isStarted = false;
  gameArr = [[null, null, null], [null, null, null], [null, null, null]];
}

const clearData = () => {
  player1Score.textContent = '';
  player2Score.textContent = '';
  player1.score = 0;
  player2.score = 0;
}

export {startGame, playRound, clearGrid, clearData, isFinished, isStarted};