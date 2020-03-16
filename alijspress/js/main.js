document.addEventListener("DOMContentLoaded", () => {
    //ініціалізація елементів DOM
    const search = document.querySelector(".search");  //поле пошуку
    const cartBtn = document.getElementById("cart");  //кнопка відкриття корзини
    const wishlistBtn = document.getElementById("wishlist");  //кнопка відкриття списку бажань
    const cart = document.querySelector(".cart");  //спливаюче вікно корзини
    const goodsWrapper = document.querySelector(".goods-wrapper");  //div з товарами на головній сторінці
    const category = document.querySelector(".category");  //div з категоріями товарів
    const cardCounter = cartBtn.querySelector(".counter");  //лічильник товарів в корзині
    const wishlistCounter = wishlistBtn.querySelector(".counter");  //лічильник товарів в списку бажань
    const cartWrapper = document.querySelector(".cart-wrapper");  //div товарів в корзині
    const confirm = document.querySelector('.cart-confirm');  //кнопка оформлення товару
    

    const wishlist = []; //лист побажань
    let goodsBasket = {}; //корзина

    //спінер для завантаження

    const loading = nameFunction => {
        const spinner = `<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`;

        if (nameFunction === "renderCard") {
            goodsWrapper.innerHTML = spinner;
        }

        /* if (nameFunction === "renderBasket") {
            cartWrapper.innerHTML = spinner;
        } */
    };

    const createCardGoodsBasket = (id, title, price, img) => { //створення карток для корзини
        const card = document.createElement("div");
        card.className = "goods";
        card.innerHTML = `<div class="goods-img-wrapper">
        <img class="goods-img" src="${img}" alt="">
            </div>
            <div class="goods-description">
                <h2 class="goods-title">${title}</h2>
                <p class="goods-price">${price} ₽</p>

            </div>
            <div class="goods-price-count">
                <div class="goods-trigger">
                    <button class="goods-add-wishlist ${
            wishlist.includes(id) ? "active" : ""
            }" data-goods-id="${id}"></button>
                    <button class="goods-delete" data-goods-id="${id}"></button>
                </div>
                <div class="goods-count-div">
                    <button class="goods-count-minus" data-goods-id="${id}">-</button>
                    <div class="goods-count">${goodsBasket[id]}</div>
                    <button class="goods-count-plus" data-goods-id="${id}">+</button>
                </div>  
            </div>`;
        return card;  //вертає картку товару
    };

    const renderBasket = goods => {  //рендерить корзину
        cartWrapper.textContent = "";
        if (goods.length) {
            goods.forEach(({ id, title, price, imgMin }) => {
                cartWrapper.appendChild(  //додає елемент  в кінець списку дочірніх елементів батьківського елемента - div товарів в корзині
                    createCardGoodsBasket(id, title, price, imgMin)
                );
            });
        } else {
            cartWrapper.innerHTML =
                '<div id="cart-empty">Ваша корзина порожня</div>';
                showOffers();
        }
    };

    const createOfferBasket = (id, title, price, img) => { //створення карток для порожньої корзини
        const card = document.createElement("div");
        card.className = "goods";
        card.innerHTML = `<div class="goods-img-wrapper">
        <img class="goods-img" src="${img}" alt="">
            </div>
            <div class="goods-description">
                <h2 class="goods-title">${title}</h2>
                <p class="goods-price">${price} ₽</p>

            </div>
            <div class="goods-price-count">
                <div class="goods-trigger">
                    <button class="goods-add-wishlist ${wishlist.includes(id) ? "active" : ""}" data-goods-id="${id}"></button>
                    <button class="card-add-cart" data-goods-id="${id}">Добавить в корзину</button>
                </div>
            </div>`;
        return card;  //вертає картку товару
    };

    const renderOffer = goods => {  //рендерить пропозиції в корзину
        cartWrapper.textContent += ", додайте товари з ваших вподобань";
        if (goods.length) {
            goods.forEach(({ id, title, price, imgMin }) => {
                cartWrapper.appendChild(  //додає елемент  в кінець списку дочірніх елементів батьківського елемента - div товарів в корзині
                    createOfferBasket(id, title, price, imgMin)
                );
            });
        } else {
            cartWrapper.innerHTML =
                `<div id="cart-empty">У вас немає вподобань</div>
                <button class="btn start-shoping">Почати покупки</button>`;
                showOffers();
                const startBtn = document.querySelector('.start-shoping');  // кнопка "почати покупки"
                startBtn.addEventListener('click', log);
        }
    };

    //запит на сервер за товарами

    const getGoods = (handler, filter) => {
        loading(handler.name);  //функція загрузки (спінер)
        fetch("db/db.json")
            .then(response => response.json())
            .then(filter)
            .then(handler);
    };

    //генерування карток в головному меню

    const createCardGoods = (id, title, price, img) => {  //генерування карток в головному меню
        const card = document.createElement("div");
        card.className = "card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3";
        card.innerHTML = `<div class="card">
                            <div class="card-img-wrapper">
                                <img class="card-img-top" src="${img}" alt="">
                                <button class="card-add-wishlist ${
            wishlist.includes(id) ? "active" : ""
            }" 
                                    data-goods-id="${id}"></button>
                            </div>
                            <div class="card-body justify-content-between">
                                <a href="#" class="card-title">${title}</a>
                                <div class="card-price">${price} ₽</div>
                                <div>
                                    <button class="card-add-cart" data-goods-id="${id}">Добавить в корзину</button>
                                </div>
                            </div>
                        </div>`;
        return card;  //вертає картку в головному меню
    };

    const renderCard = goods => {  //рендерить картку товару в головному меню
        goodsWrapper.textContent = "";
        if (goods.length) {
            goods.forEach(({ id, title, price, imgMin }) => {
                goodsWrapper.appendChild(createCardGoods(id, title, price, imgMin));  //батьківський елемент - div з товарами на головній сторінці
            });
        } else {
            goodsWrapper.textContent = "Goods not found!";
        }
    };

    //калькуляція

    const checkCount = () => {  //оновлює значення лічильників корзини та листа бажань
        wishlistCounter.textContent = wishlist.length;  
        cardCounter.textContent = Object.keys(goodsBasket).length;
    };

    const calcTotalPrice = goods => {  //підраховує загальну вартість корзини
        let sum = 0;
        for (const item of goods) {
            sum += item.price * goodsBasket[item.id];
        }
        cart.querySelector(".cart-total>span").textContent = sum.toFixed(2);
    };

    //фільтри

    const showCardBasket = goods => {  //вертає товари в корзині
        const basketGoods = goods.filter(item =>
            goodsBasket.hasOwnProperty(item.id)
        );
        calcTotalPrice(basketGoods);
        return basketGoods;
    };

    const randomSort = item => item.sort(() => Math.random() - 0.5);  //рандомне сортування товарів

    const showOffers = () => {  //ремонструє список бажань при кліку на кнопку
        getGoods(renderOffer, goods =>
            goods.filter(item => wishlist.includes(item.id))
        );
    };

    const showWishlist = () => {  //ремонструє список бажань при кліку на кнопку
        getGoods(renderCard, goods =>
            goods.filter(item => wishlist.includes(item.id))
        );
    };

    //робота зі сховищем

    const getCookie = name => {  //отримує дані з cookie; готова функція, яка працює з регулярними виразами
        let matches = document.cookie.match(
            new RegExp(
                "(?:^|; )" +
                name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
                "=([^;]*)"
            )
        );
        return matches ? decodeURIComponent(matches[1]) : undefined;
    };

    const cookieQuery = get => {
        if (get) {
            if (getCookie("goodsBasket")) {
                Object.assign(goodsBasket, JSON.parse(getCookie("goodsBasket")));  //отримує з cookie товари для корзини
            }
            checkCount();
        } else {
            document.cookie = `goodsBasket=${JSON.stringify(  //додає в cookie товари для корзини
                goodsBasket
            )}; max-age=86400e3`;  //скільки має часу зберігати дані
        }
    };

    const storageQuery = get => {  
        if (get) {
            if (localStorage.getItem("wishlist")) {
                wishlist.splice(0, 0, ...JSON.parse(localStorage.getItem("wishlist")));  //отримує з localstorage товари для списку побажань
            }
            checkCount();
        } else {
            localStorage.setItem("wishlist", JSON.stringify(wishlist));  //додає в localstorage товар
        }
        //checkCount();
    };

    //події

    const closeCart = event => {  //закриває корзину
        const target = event.target;
        if (
            target === cart ||  //якщо клік був мимо відкритого вікна корзини
            target.classList.contains("cart-close") ||  //якщо нажато на кнопку закриття корзини
            event.code == "Escape"  //якщо нажато клавішу "Escape"
        ) {
            cart.style.display = "none";  //робить вікно корзини невидимим
            document.removeEventListener("keyup", closeCart);  //забирає обробник подій, який фіксує нажимання клавіш
        }
    };

    const openCart = event => {  //відкриває корзину
        event.preventDefault();
        cart.style.display = "flex";  //робить вікно корзини видимим
        document.addEventListener("keyup", closeCart);  //додає обробник подій, який фіксує нажимання клавіш
        getGoods(renderBasket, showCardBasket);  //завантажує картки товарів в корзину
    };

    const choiceCategory = event => {  //вибирає товари певної категорії
        event.preventDefault();
        const target = event.target;

        if (target.classList.contains("category-item")) {  //якщо нажато на категорію
            const category = target.dataset.category;
            getGoods(renderCard, goods =>
                goods.filter(item => item.category.includes(category))  //вертає товари, які в списку категорій містять дану
            );
        }
    };

    const searchGoods = event => {   //пошук товарів
        event.preventDefault();
        const input = event.target.elements.searchGoods;
        const inputValue = input.value.trim(); //trim() - вертає рядок без пробілів на початку і в кінці
        if (inputValue !== "") {
            const searchString = new RegExp(inputValue, "g");  //регулярне вираження ПОЧИТАТИ
            getGoods(renderCard, goods =>  //вертає товари, які відповідають запиту
                goods.filter(item => searchString.test(item.title))  //filter і test ПОЧИТАТИ
            ); 
        } else {  //робить блик, якщо поле порожнє
            input.classList.add("error"); 
            setTimeout(() => {
                input.classList.remove("error");
            }, 2000);
        }

        event.target.elements.searchGoods.value = "";  //очищає форму
    };

    const toggleWishlist = (id, elem) => {  //додає та забирає елементи зі списку бажань, приймає id і сам елемент
        if (wishlist.includes(id)) {  //якщо цей товар вже є в списку бажань
            wishlist.splice(wishlist.indexOf(id), 1);  //видаляє 1 елементу, починаючи з індекса wishlist.indexOf(id)
            elem.classList.remove("active");  //видаляє клас, робить "сердечко" неактивним
        } else {
            wishlist.push(id);  //додає id товару в список побажань
            elem.classList.add("active");  //видаляє клас, робить "сердечко" неактивним
        }
        checkCount();
        storageQuery();  //оновлює localstorage, де зберігається wishlist
    };

    const addBasket = id => {   //додає 1 шт товару в корзину
        if (goodsBasket[id]) { 
            goodsBasket[id] += 1;  //якщо товар вже є, то збільшує к-сть на 1
        } else {
            goodsBasket[id] = 1;  
        }
        cookieQuery();
        checkCount();
    };

    const removeBasket = id => {  //видаляє 1 шт товару з корзини
        if (goodsBasket[id] === 1) {
            removeGoods(id);  //видаляє повністю товар, якщо його к-сть === 1
        } else {
            goodsBasket[id] -= 1;  //зменшує к-сть товару на 1
        }
        cookieQuery();
        checkCount();
    };

    const removeGoods = id => {  //видаляє товар повністю з корзини
        delete goodsBasket[id];
        checkCount();
        cookieQuery();
        getGoods(renderBasket, showCardBasket);
    };

    const confirmOrder = () => {  //очищає корзину після оформлення замовлення
        Object.keys(goodsBasket).forEach(good => removeGoods(good));
        cookieQuery();
        checkCount();
    };

    //обробники подій кліків на картку товару

    const handlerGoods = event => {  //оборобляє події на карточці товару
        const target = event.target;
        if (target.classList.contains("card-add-wishlist")) {  //додає в список бажань
            toggleWishlist(target.dataset.goodsId, target);
        }
        if (target.classList.contains("card-add-cart")) {  //додає в корзину
            addBasket(target.dataset.goodsId);
        }
    };

    const handlerBasket = () => {  //обробляє події в корзині
        const target = event.target;
        if (target.classList.contains("goods-add-wishlist")) {  //клік на "сердечко"
            toggleWishlist(target.dataset.goodsId, target);
        }
        if (target.classList.contains("goods-delete")) {  //клік для видалення з корзини
            removeGoods(target.dataset.goodsId);
        }
        if(target.classList.contains("goods-count-plus")){  //додавання товару
            addBasket(target.dataset.goodsId);
            target.previousElementSibling.textContent = goodsBasket[target.dataset.goodsId];
            getGoods(renderBasket, showCardBasket);
        }
        if(target.classList.contains("goods-count-minus")){  //віднімаття товару
            removeBasket(target.dataset.goodsId);
            target.nextElementSibling.textContent = goodsBasket[target.dataset.goodsId];
            getGoods(renderBasket, showCardBasket);
        }
    };

    const log = () =>{
        console.log("click");
    };
    //ініціалізація
    {
        getGoods(renderCard, randomSort);  //рендерить картки товарів на головній сторінці при загрузці вперше
        storageQuery(true);  //отримує дані з localstorage щодо списку побажань
        cookieQuery(true);  //отримує дані з cookie щодо корзини

        //обробка подій

        cartBtn.addEventListener("click", openCart);  //відкриває корзину
        cart.addEventListener("click", closeCart);  //закриває корзину
        category.addEventListener("click", choiceCategory);  //вертає товари з обраної категорії
        search.addEventListener("submit", searchGoods);  //надсилання форми пошуку товару
        goodsWrapper.addEventListener("click", handlerGoods);  //обробляє кліки на карточку товару в меню
        cartWrapper.addEventListener("click", handlerBasket);  //обробляє кліки на карточку товару в корзині
        wishlistBtn.addEventListener("click", showWishlist);  //показує список бажань
        confirm.addEventListener('click', confirmOrder);  //очищає корзину після оформлення замовлення
    }
});
