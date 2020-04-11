const formSearch = document.querySelector('.form-search');
const inputCitiesFrom = document.querySelector('.input__cities-from');
const dropdownCitiesFrom = document.querySelector('.dropdown__cities-from');
const inputCitiesTo = document.querySelector('.input__cities-to');
const dropdownCitiesTo = document.querySelector('.dropdown__cities-to');
const inputDateDepart = document.querySelector('.input__date-depart');

//const citiesApi = '../database/cities.json';
const citiesApi = 'https://api.travelpayouts.com/data/en/cities.json';
const proxy = 'https://cors-anywhere.herokuapp.com/';
const API_KEY = 'f6f597c1b64935bdb69a564badfe334d';
const calendar = 'http://min-prices.aviasales.ru/calendar_preload';

let city = [];

const getData = (url, callback) => {
    const request = new XMLHttpRequest();

    request.open('GET', url);
    
    request.addEventListener('readystatechange', () => {
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
        return fixItem.includes(input.value.toLowerCase());     
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

const renderCheapDay = (cheapTicket) => {
    console.log(cheapTicket);
}

const renderCheapYear = (cheapTickets) => {
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
        from: cityFrom.code,
        to: cityTo.code,
        date: inputDateDepart.value
    }
    console.log(formData);

    const requestData = `?depart_date=${formData.date}&origin=${formData.from}&destination=${formData.to}&one_way=true&token=`
    
    //'?depart_date=' + formData.date + '&origin=' + formData.from + '&destination=' + formData.to + '&one_way=true&token=';

    getData(calendar + requestData + API_KEY, (response) => {
        renderCheap(response, formData.date);
    });
});

getData(proxy + citiesApi, (data) => {
    city = JSON.parse(data).filter(item => item.name);
});

