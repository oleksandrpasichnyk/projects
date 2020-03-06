const record = document.getElementById('record');
const shot = document.getElementById('shot');
const hit = document.getElementById('hit');
const dead = document.getElementById('dead');
const enemy = document.getElementById('enemy');
const again = document.getElementById('again');
const fields = document.querySelectorAll('td');
const header = document.querySelector('.header');

const game = {
    ships: [
        {
            location: ['26', '36', '46', '56'],
            hits: ['', '', '', '']
        },
        {
            location: ['11', '12', '13'],
            hits: ['', '', '',]
        },
        {
            location: ['69', '79'],
            hits: ['', ''] 
        },
        {
            location: ['32'],
            hits: ['']
        }
    ],
    shipCount: 4
}

const play = {
    record: localStorage.getItem('seaBattleRecord') || 0,
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
    //target.removeEventListener('click', fire);
    if(target.localName !== 'td' || target.classList.length !== 0){return}
    show.miss(target);
    play.updateData = 'shot';  
    for(let i=0; i<game.ships.length; i++){
        const ship = game.ships[i];
        const index = ship. location.indexOf(target.id);
        if(index >=0){
            show.hit(target);
            play.updateData = 'hit';
            ship.hits[index] = 'x';
            const life = ship.hits.indexOf('');
            if(life < 0){
                play.updateData = 'dead';
                for (const id of ship.location) {
                    show.dead(document.getElementById(id));
                }
                game.shipCount--;
                if(game.shipCount < 1){
                    header.textContent = 'GAME OVER';
                    header.style.color = 'red';

                    enemy.removeEventListener('click', fire);

                    if(play.shot < play.record || play.record === 0){
                        localStorage.setItem('seaBattleRecord', play.shot);
                    play.record = play.shot;
                    play.render();
                    }                
                }
            }
        }
    }
}

const init = () => {
    enemy.addEventListener('click', fire);
    play.render();

    again.addEventListener('click', () => {
        location.reload();
    });
};

init(); 

/*fields.forEach(field => {
    field.addEventListener('click', fire);
});*/