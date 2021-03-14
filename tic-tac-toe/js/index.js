import {startGame, playRound, clearGrid, clearData, isFinished, isStarted} from './game.js';

const gameField = document.querySelector('.game-field');

const newGameBtn = document.querySelector('.new-game-btn');
const resetBtn = document.querySelector('.reset-btn');

gameField.addEventListener('click', function(event){
  let cell = event.target.closest('td');
  if(!isStarted){
    startGame();
  }
  if(!cell.hasChildNodes() && !isFinished()){
    playRound(cell, cell.dataset.row, cell.dataset.col);
  }
});

newGameBtn.addEventListener('click', function(){
  clearGrid();
});

resetBtn.addEventListener('click', function(){
  clearGrid();
  clearData();
});

export { gameField };