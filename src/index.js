// Импорты

// Импорт JS

import {addLike, deleteLike} from './components/card.js';
import {openPopup, closePopup} from './components/modal.js';
import initialCards from './components/cards.js';

// Импорт CSS

import './pages/index.css';


// Забиндил поиск элемента в DOM

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


// Переменные

// Сохраняю шаблон карточки

const cardTemplate = $('#card-template').content;

// Записал список карточек

const placesCardList = $('.places__list');


// Кнопки

// Кнопка открытия попапа редактирования профиля

const popupEditButton = $('.profile__edit-button');

// Кнопка открытия попапа добавления карточки

const popupAddCardButton = $('.profile__add-button');

// Кнопки закрытия попапов

const popupCloseButtons = $$('.popup__close');


// Попапы

// Массив из всех попапов на странице

const popups = $$('.popup');

// Попап редактирования профиля

const editProfilePopup = $('.popup_type_edit');

// Попап добавления карточки

const addCardPopup = $('.popup_type_new-card');

// Попап с большой картинкой карточки

const popupCardImage = $('.popup_type_image');


//Обработчики

// Обработчик кнопки редактирования профиля.
// Открывает попап редактирования профиля

popupEditButton.addEventListener('click', () => {
    openPopup(editProfilePopup);
})

// Обработчик кнопки открытия попапа добавления карточки

popupAddCardButton.addEventListener('click', () => {
    openPopup(addCardPopup);
})

// Обработчик кнопок закрытия попапов

popupCloseButtons.forEach((button) => {
    button.addEventListener('click', () => {
        closePopup(button.closest('.popup'));
    })
})

// Закрытие попапа кликом по оверлею
popups.forEach((popup) => {
    popup.addEventListener('mousedown', (e) => {
        if (e.target === popup) {
            closePopup(popup);
        }
    })
})


// Функции

// Функция создания карточки
// принимает данные для заполнения карточки и функцию удаления карточки
function createCard(cardData, deleteFunction, addLike, deleteLike, handleCardImageClick) {

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

    // Слушатель клика на картинку карточки.
    // Вызывает обработчик клика, который показывает попап с большой картинкой
    cardImage.addEventListener('click', () => {
        handleCardImageClick(cardItem);
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

// Обработчик клика по карточке.
// Копирует src и alt картинки карточки в картинку попапа.
// Копирует заголовок карточки в текст попапа

function handleCardImageClick(card) {

    // Картинка карточки
    const cardImage = card.querySelector('.card__image');

    // Заголовок карточки
    const cardTitle = card.querySelector('.card__title');

    // Картинка попапа
    const imagePopup = popupCardImage.querySelector('.popup__image');

    // Текст попапа
    const textPopup = popupCardImage.querySelector('.popup__caption');

    // Копирует заголовок карточки в текст попапа
    textPopup.textContent = cardTitle.textContent;

    //Копирует src и alt картинки карточки в картинку попапа
    Object.assign(imagePopup, {
        src: cardImage.src,
        alt: cardImage.alt,
    })
    openPopup(popupCardImage);
}

// Функция удаления карточек.
// Удаляет элемент из разметки
function deleteCard(element) {
    element.remove();
}

// Перебирает массив с данными карточек,
// передаёт данные карточек в функцию создания карточки
initialCards.forEach((item) => {

// Добавляет на страницу список заполненных карточек
    placesCardList.append(createCard(item, deleteCard, addLike, deleteLike, handleCardImageClick));
})