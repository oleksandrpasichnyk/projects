const startBtn = document.getElementById('start-btn');
const skipBtn = document.getElementById('skip-btn');
const quizArea = document.getElementById('quiz-area');
const questionTitle = document.getElementById('question-title');
const answer1 = document.getElementById('answer-1-text');
const answer2 = document.getElementById('answer-2-text');
const answer3 = document.getElementById('answer-3-text');
const answer4 = document.getElementById('answer-4-text');
const totalPrize = document.getElementById('total-prize');
const currentRoundPrize = document.getElementById('current-round-prize');
const answers = document.getElementById('answers');
const resultArea = document.getElementById('result-area');
const resultText = document.getElementById('result-text');

const questions = JSON.parse(localStorage.questions);

let questionIndexes = [...questions.keys()];

let gameData = {
  total: 0,
  current: 100,
  currentQuestion: {},
  skipped: 0
}

let currentGameData = Object.assign({}, gameData);

const renderSkipBtn = () => {
  skipBtn.disabled = currentGameData.skipped === 1;
  skipBtn.className = currentGameData.skipped === 0 ? 'btn' : 'disabled-btn';
}

const renderPoints = () => {
  totalPrize.textContent = currentGameData.total;
  currentRoundPrize.textContent = currentGameData.current;
};

const getRamdomQuestion = () => {
  let index = questionIndexes.splice(Math.floor(Math.random() * questionIndexes.length), 1);
  return questions[index];
};

const uploadNewQueation = (question) => {
  questionTitle.textContent = question.question;
  answer1.textContent = question.content[0];
  answer2.textContent = question.content[1];
  answer3.textContent = question.content[2];
  answer4.textContent = question.content[3];
  renderPoints();
  currentGameData.currentQuestion = question;
};

const showQuizArea = () => {
  uploadNewQueation(getRamdomQuestion());
  skipBtn.style.display = 'block';
  quizArea.style.display = 'flex';
};

const startGame = () => {
  resultArea.style.display = 'none';
  currentGameData = Object.assign({}, gameData);
  questionIndexes = [...questions.keys()];
  showQuizArea();
  renderSkipBtn();
  renderPoints();
};

const finishGame = () => {
  skipBtn.style.display = 'none';
  resultArea.style.display = 'flex';
  resultText.textContent = `Game over! Your prize is ${currentGameData.total}`;
};

const displayWin = () => {
  skipBtn.style.display = 'none';
  resultArea.style.display = 'flex';
  resultText.textContent = 'Congratulations! You won 10000000';
};

const checkAnswer = event => {
  if(event.target.id !== 'answers'){
    if(event.target.classList.contains(`answer-${currentGameData.currentQuestion.correct + 1}`)){
      currentGameData.total += currentGameData.current;
      currentGameData.current *= 2;
      if(currentGameData.total >= 1000000){
        displayWin();
      }
      uploadNewQueation(getRamdomQuestion());
    }else{
      finishGame();
    }
  }
}

startBtn.addEventListener('click', startGame, false);

answers.addEventListener('click', checkAnswer, false);

skipBtn.addEventListener('click', function(){
    currentGameData.skipped += 1;
    uploadNewQueation(getRamdomQuestion());
    renderSkipBtn();
});