// Импорты

// Импорт JS

import {addLike, deleteLike} from './components/card.js';
import initialCards from './components/cards.js';

// Импорт CSS
import './pages/index.css';

// Забиндил поиск элемента в DOM
const $ = document.querySelector.bind(document);


// Переменные

// Сохраняю шаблон карточки
const cardTemplate = $('#card-template').content;

// Записал список карточек
const placesCardList = $('.places__list');

// Обработчик клика кнопки лайка


// Функции

// Функция создания карточки
// принимает данные для заполнения карточки и функцию удаления карточки
function createCard(cardData, deleteFunction, addLike, deleteLike) {

// Копирует шаблон карточки
    const cardItem = cardTemplate.querySelector('.card').cloneNode(true);

// Кнопка удаления карточки
    const deleteButton = cardItem.querySelector('.card__delete-button');

// Кнопка лайка карточки
    const likeButton = cardItem.querySelector('.card__like-button');

// Картинка карточки
    const cardImage = cardItem.querySelector('.card__image');

// Слушатель кнопки удаления карточки
    deleteButton.addEventListener('click', () => {
        deleteFunction(cardItem);
    });

// Слушатель кнопки лайка карточки
    likeButton.addEventListener('click', () => {
        if (likeButton.classList.contains('card__like-button_is-active')) {
            deleteLike(likeButton);
        } else {
            addLike(likeButton);
        }
    });

// Записывает заголовок карточки
    cardItem.querySelector('.card__title').textContent = cardData.name;

// Записывает ссылку и альт текст картинки карточки
    Object.assign(cardImage, {
        src: cardData.link,
        alt: cardData.name,
    })

// Возвращает заполненную карточку
    return cardItem;
}

// Функция удаления карточек
// принимает карточку
function deleteCard(element) {
    element.remove();
}

// Перебирает массив с данными карточек,
// передаёт данные карточек в функцию создания карточки
initialCards.forEach((item) => {

// Добавляет на страницу список заполненных карточек
    placesCardList.append(createCard(item, deleteCard, addLike, deleteLike));
})