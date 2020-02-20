const cards = document.querySelectorAll('.memory-card');

let hasFlippedCard = false;
let firstCard, secondCard;
let boardLocked = false;

const flipCard = e => {
    if(boardLocked){return};
    const target = e.target;

    if(target === firstCard){return};

    target.classList.add('flip');

    if(!hasFlippedCard){
        hasFlippedCard = true;
        firstCard = target;
    }
    else{
        hasFlippedCard = false;
        secondCard = target;
        checkForMatch();
    }
};

const checkForMatch = () => {

    const isEqual = firstCard.dataset.framework === secondCard.dataset.framework;
    isEqual ? disableCards() : unflipCards();
    
    // if(firstCard.dataset.framework === secondCard.dataset.framework){
    //     disableCards();
    // }else{
    //     unflipCards();
    // }
};

const disableCards = () => {
    boardLocked = true;
        console.log('equal');
        setTimeout(() => {
            firstCard.style.visibility = "hidden";
            secondCard.style.visibility = "hidden";
            resetBoard();
        }, 1000);
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
};

const unflipCards = () => {
    boardLocked = true;
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');

            resetBoard();     
        }, 1000);
};

const resetBoard = () => {
    [hasFlippedCard, boardLocked] = [false, false];
    [firstCard, secondCard] = [null, null];
};

cards.forEach(card => {
    card.addEventListener('click', flipCard);

    const randomIndex = Math.floor(Math.random() * cards.length);
    card.style.order = randomIndex;
});