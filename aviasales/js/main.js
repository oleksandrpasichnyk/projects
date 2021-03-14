const formSearch = document.querySelector('.form-search');
const inputCitiesFrom = document.querySelector('.input__cities-from');
const dropdownCitiesFrom = document.querySelector('.dropdown__cities-from');
const inputCitiesTo = document.querySelector('.input__cities-to');
const dropdownCitiesTo = document.querySelector('.dropdown__cities-to');
const inputDateDepart = document.querySelector('.input__date-depart');
const cheapestTicket = document.querySelector('#cheapest-ticket');
const otherCheapTicket = document.querySelector('#other-cheap-tickets');
const moreBtn = document.querySelector('.moreBtn');

//const citiesApi = '../database/cities.json';
const citiesApi = 'https://api.travelpayouts.com/data/en/cities.json';
const proxy = 'https://cors-anywhere.herokuapp.com/';
const API_KEY = 'f6f597c1b64935bdb69a564badfe334d';
const calendar = 'http://min-prices.aviasales.ru/calendar_preload';

let requestStatus = 200;

const maxCount = 10;
let city = [];

const getData = (url, callback) => {
    const request = new XMLHttpRequest();

    request.open('GET', url);
    
    request.addEventListener('readystatechange', () => {
        requestStatus = request.status;
        if(request.readyState !== 4) return;

        if(request.status === 200){
            callback(request.response);
        }else{
            console.error(request.status);
        }
        
    });

    request.send();
};

const showCity = (input, list) => {
    list.textContent = '';

    if(!input.value) return;
    const filterCity = city.filter((item) => {
        const fixItem = item.name.toLowerCase();
        return fixItem.startsWith(input.value.toLowerCase());     
    });

    filterCity.forEach((item) => {
        const li = document.createElement('li');
        li.classList.add('dropdown__city');
        li.textContent = item.name;
        list.append(li);
    });
};

const handlerCity = (event, input, list) => {
    const target = event.target;
    if(target.tagName.toLowerCase() === 'li'){
        input.value = target.textContent;
        list.textContent = '';
    }
};

const getChanges = n => n === 0 ? 'Without changes' : `With ${n} changes`;

const getDate = (date) => {
    return new Date(date).toLocaleString('en', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const getLinkAviasales = (data) => {
    let link = `https://www.aviasales.ru/search/`;

    const date = new Date(data.depart_date);
    const day = date.getDate();
    const month = date.getMonth() + 1; 
    link += data.origin;
    link += day < 10 ? '0' + day : day; 
    link += month < 10 ? '0' + month : month; 
    link += data.destination + '1';
    return link;
};

const createCard = (data) => {
    const ticket = document.createElement('article');
    ticket.classList.add('ticket');

    let deep = ``;

    if(data){
        deep = `
            <h3 class="agent">${data.gate}</h3>
            <div class="ticket__wrapper">
                <div class="left-side">
                    <a href="${getLinkAviasales(data)}" target="_blank" class="button button__buy">Buy for ${data.value}₽</a>
                </div>
                <div class="right-side">
                    <div class="block-left">
                        <div class="city__from">From:
                            <span class="city__name">${data.origin}</span>
                        </div>
                        <div class="city__to">To:
                            <span class="city__name">${data.destination}</span>
                        </div>
                        
                    </div>

                    <div class="block-right">
                        <div class="changes">${getChanges(data.number_of_changes)}</div>
                        <div class="date">${getDate(data.depart_date)}</div>
                    </div>
                </div>
            </div>
            `
    }else{
        deep = `<h3>No tickets on current date</h3>`
    }
    
    ticket.insertAdjacentHTML('afterbegin', deep);

    return ticket;
}

const renderCheapDay = (cheapTicket) => {
    cheapestTicket.style.display = 'block';
    cheapestTicket.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>';
    const ticket = createCard(cheapTicket[0]);
    cheapestTicket.append(ticket);
    console.log(cheapTicket);
}

const renderCheapYear = (cheapTickets) => {
    otherCheapTicket.style.display = 'block';
    otherCheapTicket.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>';
    cheapTickets.sort((a, b) => a.value - b.value);

    for(let i = 0; i < cheapTickets.length && i < maxCount; i++){
        otherCheapTicket.append(createCard(cheapTickets[i]));
    }

    otherCheapTicket.innerHTML += `<p class="moreBtn">Show more tickets</p>`;
    moreBtn.addEventListener('click', () => {
        for(let i = maxCount; i < cheapTickets.length; i++){
            otherCheapTicket.append(createCard(cheapTickets[i]));
        }
    })

    console.log(cheapTickets);
}

const renderCheap = (data, date) => {
    const cheapTicketsYear = JSON.parse(data).best_prices;

    const cheapTicketDay = cheapTicketsYear.filter((item) => {
        return item.depart_date === date;
    });
    
    renderCheapDay(cheapTicketDay);
    renderCheapYear(cheapTicketsYear);
}

inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropdownCitiesFrom);
});

inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropdownCitiesTo);
});

dropdownCitiesFrom.addEventListener('click', (event) => {
    handlerCity(event, inputCitiesFrom, dropdownCitiesFrom);
});

dropdownCitiesTo.addEventListener('click', (event) => {
    handlerCity(event, inputCitiesTo, dropdownCitiesTo);
});

formSearch.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const cityFrom = city.find(item => inputCitiesFrom.value === item.name);
    const cityTo = city.find(item => inputCitiesTo.value === item.name);
    const formData = {
        from: cityFrom,
        to: cityTo,
        date: inputDateDepart.value
    }
    console.log(formData);

    if(formData.from && formData.to){
        const requestData = `?depart_date=${formData.date}&origin=${formData.from.code}&destination=${formData.to.code}&one_way=true&token=`
    
        //'?depart_date=' + formData.date + '&origin=' + formData.from + '&destination=' + formData.to + '&one_way=true&token=';

        getData(calendar + requestData + API_KEY, (response) => {
            renderCheap(response, formData.date);
        });
    }else{
        if(requestStatus !== 429){
            alert("Uncorrect city name");
        }
        else{
            cheapestTicket.innerHTML = '<p class="alert_error">Too many requests, try later!</p>';
        }
    }
});

getData(proxy + citiesApi, (data) => {
    city = JSON.parse(data).filter(item => item.name);
    city.sort((a, b)=>{
        if(a.name > b.name){
            return 1;
        }
        if(a.name < b.name){
            return -1;
        }
        return 0;
    })
});

