"use strict";

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

document.addEventListener('DOMContentLoaded', function () {
  //ініціалізація елементів DOM
  var search = document.querySelector('.search');
  var cartBtn = document.getElementById('cart');
  var wishlistBtn = document.getElementById('wishlist');
  var cart = document.querySelector('.cart');
  var goodsWrapper = document.querySelector('.goods-wrapper');
  var category = document.querySelector('.category');
  var cardCounter = cartBtn.querySelector('.counter');
  var wishlistCounter = wishlistBtn.querySelector('.counter');
  var cartWrapper = document.querySelector('.cart-wrapper');
  var wishlist = []; //лист побажань

  var goodsBasket = {}; //корзина
  //спінер для завантаження

  var loading = function loading(nameFunction) {
    var spinner = "<div id=\"spinner\"><div class=\"spinner-loading\"><div><div><div></div>\n        </div><div><div></div></div><div><div></div></div><div><div></div></div></div></div></div>";

    if (nameFunction === 'renderCard') {
      goodsWrapper.innerHTML = spinner;
    }

    if (nameFunction === 'renderBasket') {
      cartWrapper.innerHTML = spinner;
    }
  }; //створення карток для корзини


  var createCardGoodsBasket = function createCardGoodsBasket(id, title, price, img) {
    var card = document.createElement('div');
    card.className = 'goods';
    card.innerHTML = "<div class=\"goods-img-wrapper\">\n        <img class=\"goods-img\" src=\"".concat(img, "\" alt=\"\">\n            </div>\n            <div class=\"goods-description\">\n                <h2 class=\"goods-title\">").concat(title, "</h2>\n                <p class=\"goods-price\">").concat(price, " \u20BD</p>\n\n            </div>\n            <div class=\"goods-price-count\">\n                <div class=\"goods-trigger\">\n                    <button class=\"goods-add-wishlist ").concat(wishlist.includes(id) ? 'active' : '', "\" data-goods-id=\"").concat(id, "\"></button>\n                    <button class=\"goods-delete\" data-goods-id=\"").concat(id, "\"></button>\n                </div>\n                <div class=\"goods-count\">").concat(goodsBasket[id], "</div>\n            </div>");
    return card;
  };

  var renderBasket = function renderBasket(goods) {
    cartWrapper.textContent = '';

    if (goods.length) {
      goods.forEach(function (_ref) {
        var id = _ref.id,
            title = _ref.title,
            price = _ref.price,
            imgMin = _ref.imgMin;
        cartWrapper.appendChild(createCardGoodsBasket(id, title, price, imgMin));
      });
    } else {
      cartWrapper.innerHTML = '<div id="cart-empty">Ваша корзина пока пуста</div>';
    }
  }; //запит на сервер за товарами


  var getGoods = function getGoods(handler, filter) {
    loading(handler.name);
    fetch('db/db.json').then(function (response) {
      return response.json();
    }).then(filter).then(handler);
  }; //генерування карток в головному меню


  var createCardGoods = function createCardGoods(id, title, price, img) {
    var card = document.createElement('div');
    card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
    card.innerHTML = "<div class=\"card\">\n                            <div class=\"card-img-wrapper\">\n                                <img class=\"card-img-top\" src=\"".concat(img, "\" alt=\"\">\n                                <button class=\"card-add-wishlist ").concat(wishlist.includes(id) ? 'active' : '', "\" \n                                    data-goods-id=\"").concat(id, "\"></button>\n                            </div>\n                            <div class=\"card-body justify-content-between\">\n                                <a href=\"#\" class=\"card-title\">").concat(title, "</a>\n                                <div class=\"card-price\">").concat(price, " \u20BD</div>\n                                <div>\n                                    <button class=\"card-add-cart\" data-goods-id=\"").concat(id, "\">\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443</button>\n                                </div>\n                            </div>\n                        </div>");
    return card;
  };

  var renderCard = function renderCard(goods) {
    goodsWrapper.textContent = '';

    if (goods.length) {
      goods.forEach(function (_ref2) {
        var id = _ref2.id,
            title = _ref2.title,
            price = _ref2.price,
            imgMin = _ref2.imgMin;
        goodsWrapper.appendChild(createCardGoods(id, title, price, imgMin));
      });
    } else {
      goodsWrapper.textContent = 'Goods not found!';
    }
  }; //калькуляція


  var checkCount = function checkCount() {
    wishlistCounter.textContent = wishlist.length;
    cardCounter.textContent = Object.keys(goodsBasket).length;
  };

  var calcTotalPrice = function calcTotalPrice(goods) {
    var sum = 0;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = goods[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;
        sum += item.price * goodsBasket[item.id];
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    cart.querySelector('.cart-total>span').textContent = sum.toFixed(2);
  }; //фільтри


  var showCardBasket = function showCardBasket(goods) {
    var basketGoods = goods.filter(function (item) {
      return goodsBasket.hasOwnProperty(item.id);
    });
    calcTotalPrice(basketGoods);
    return basketGoods;
  };

  var randomSort = function randomSort(item) {
    return item.sort(function () {
      return Math.random() - 0.5;
    });
  };

  var showWishlist = function showWishlist() {
    getGoods(renderCard, function (goods) {
      return goods.filter(function (item) {
        return wishlist.includes(item.id);
      });
    });
  }; //робота зі сховищем


  var getCookie = function getCookie(name) {
    var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  };

  var cookieQuery = function cookieQuery(get) {
    if (get) {
      if (getCookie('goodsBasket')) {
        Object.assign(goodsBasket, JSON.parse(getCookie('goodsBasket'))); //goodsBasket = JSON.parse(getCookie('goodsBasket'));
      }

      checkCount();
    } else {
      document.cookie = "goodsBasket=".concat(JSON.stringify(goodsBasket), "; max-age=86400e3");
    }
  };

  var storageQuery = function storageQuery(get) {
    if (get) {
      if (localStorage.getItem('wishlist')) {
        wishlist.splice.apply(wishlist, [0, 0].concat(_toConsumableArray(JSON.parse(localStorage.getItem('wishlist')))));
      }

      checkCount();
    } else {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } //checkCount();

  }; //події


  var closeCart = function closeCart(event) {
    var target = event.target; //console.log(target);

    if (target === cart || target.classList.contains('cart-close') || event.code == 'Escape') {
      cart.style.display = 'none';
      document.removeEventListener('keyup', closeCart);
    }
  };

  var openCart = function openCart(event) {
    event.preventDefault();
    cart.style.display = 'flex';
    document.addEventListener('keyup', closeCart);
    getGoods(renderBasket, showCardBasket);
  };

  var choiceCategory = function choiceCategory(event) {
    event.preventDefault();
    var target = event.target;

    if (target.classList.contains('category-item')) {
      var _category = target.dataset.category;
      console.log(_category);
      getGoods(renderCard, function (goods) {
        return goods.filter(function (item) {
          return item.category.includes(_category);
        });
      });
    }
  };

  var searchGoods = function searchGoods(event) {
    event.preventDefault();
    var input = event.target.elements.searchGoods;
    var inputValue = input.value.trim();

    if (inputValue !== '') {
      var searchString = new RegExp(inputValue, 'g');
      getGoods(renderCard, function (goods) {
        return goods.filter(function (item) {
          return searchString.test(item.title);
        });
      });
    } else {
      input.classList.add('error');
      setTimeout(function () {
        input.classList.remove('error');
      }, 2000);
    }

    inputValue = (_readOnlyError("inputValue"), '');
  };

  var toggleWishlist = function toggleWishlist(id, elem) {
    if (wishlist.includes(id)) {
      wishlist.splice(wishlist.indexOf(id), 1);
      elem.classList.remove('active');
    } else {
      wishlist.push(id);
      elem.classList.add('active');
    } //console.log(wishlist);


    checkCount();
    storageQuery();
  };

  var addBasket = function addBasket(id) {
    if (goodsBasket[id]) {
      goodsBasket[id] += 1;
    } else {
      goodsBasket[id] = 1;
    }

    cookieQuery();
    checkCount();
  };

  var removeGoods = function removeGoods(id) {
    delete goodsBasket[id];
    checkCount();
    cookieQuery();
    getGoods(renderBasket, showCardBasket);
  }; //


  var handlerGoods = function handlerGoods(event) {
    var target = event.target;

    if (target.classList.contains('card-add-wishlist')) {
      toggleWishlist(target.dataset.goodsId, target);
    }

    if (target.classList.contains('card-add-cart')) {
      addBasket(target.dataset.goodsId);
    }
  };

  var handlerBasket = function handlerBasket() {
    var target = event.target;

    if (target.classList.contains('goods-add-wishlist')) {
      toggleWishlist(target.dataset.goodsId, target);
    }

    if (target.classList.contains('goods-delete')) {
      removeGoods(target.dataset.goodsId);
    }
  }; //ініціалізація


  {
    getGoods(renderCard, randomSort);
    storageQuery(true);
    cookieQuery(true); //обробка подій

    cartBtn.addEventListener('click', openCart);
    cart.addEventListener('click', closeCart);
    category.addEventListener('click', choiceCategory);
    search.addEventListener('submit', searchGoods);
    goodsWrapper.addEventListener('click', handlerGoods);
    cartWrapper.addEventListener('click', handlerBasket);
    wishlistBtn.addEventListener('click', showWishlist);
  }
  ;
});