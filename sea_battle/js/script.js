const record = document.getElementById('record');
const shot = document.getElementById('shot');
const hit = document.getElementById('hit');
const dead = document.getElementById('dead');
const enemy = document.getElementById('enemy');
const again = document.getElementById('again');
const fields = document.querySelectorAll('td');

const play = {
    record: 0,
    shot: 0,
    hit: 0,
    dead: 0,
    set updateData(data){
        this[data]++;
        this.render();
    },
    render(){
        record.textContent = this.record;
        shot.textContent = this.shot;
        hit.textContent = this.hit;
        dead.textContent = this.dead;
    }
}

const show = {
    hit(elem){
        elem.className = 'hit';
    },
    miss(elem){
        elem.className = 'miss';
    },
    dead(elem){
        elem.className = 'dead';
    }
}

const fire = (event) => {
    const target = event.target;
    console.log(target.localName, target.id);
    target.removeEventListener('click', fire);
    //if(target.localName === 'td'){
        show.miss(target);
        play.updateData = 'shot';  
    //}
}

/* const init = () => {
    enemy.addEventListener('click', fire);
};

init(); */

fields.forEach(field => {
    field.addEventListener('click', fire);
    //const randomIndex = Math.floor(Math.random() * cards.length);
    //card.style.order = randomIndex;
});