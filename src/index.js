/**
 * Главный модуль приложения: подключает стили, модули, инициализирует интерфейс и взаимодействие.
 *
 * Импортирует:
 * - Функции управления лайками карточек
 * - Функции открытия и закрытия модальных окон
 * - Начальные данные карточек
 * - Основной CSS файл
 */

import {addLike, deleteLike} from './components/card.js';
import {openPopup, closePopup} from './components/modal.js';
import initialCards from './components/cards.js';
import './pages/index.css';


/**
 * Утилиты DOM: сокращения для document.querySelector и document.querySelectorAll
 */
export const $ = document.querySelector.bind(document);
export const $$ = document.querySelectorAll.bind(document);


// DOM-элементы

//  Шаблон карточки

const cardTemplate = $('#card-template').content;

// Список карточек

const placesCardList = $('.places__list');

// Кнопка открытия попапа редактирования профиля

const popupEditButton = $('.profile__edit-button');

// Кнопка открытия попапа добавления карточки

const popupAddCardButton = $('.profile__add-button');

// Кнопки закрытия попапов

const popupCloseButtons = $$('.popup__close');


// Попапы

// Попап редактирования профиля

const editProfilePopup = $('.popup_type_edit');

// Попап добавления карточки

const addCardPopup = $('.popup_type_new-card');

// Попап с большой картинкой карточки

const popupCardImage = $('.popup_type_image');


// Формы

// Форма редактирования профиля
const formEditProfile = document.forms['edit-profile'];


// Текстовое поле с именем пользователя формы редактирования профиля
let profileNameInput =  formEditProfile.elements['name'];

// Текстовое поле с профессией пользователя формы редактирования профиля
let profileDescriptionInput =  formEditProfile.elements['description'];

// Форма добавления карточки
const formAddCard = document.forms['new-place'];

// Текстовое поле с названием места формы добавления карточки
const placeNameInput = formAddCard.elements['place-name'];

// Текстовое поле со ссылкой на картинку формы добавления карточки
const placeLinkInput = formAddCard.elements['link'];

// Заголовок профиля
let profileTitle = $('.profile__title');

// Описание профиля
let profileDescription = $('.profile__description');


// Функции обработчики

/**
 * Обработчик кнопки редактирования профиля.
 *
 * При клике:
 * - Подставляет текущие значения имени и описания профиля
 *   в соответствующие поля формы.
 * - Открывает попап с формой редактирования профиля.
 */
function handleEditButtonClick() {
    profileNameInput.value = profileTitle.textContent;
    profileDescriptionInput.value = profileDescription.textContent;
    openPopup(editProfilePopup);
}

popupEditButton.addEventListener('click', handleEditButtonClick);

/**
 * Обработчик отправки формы редактирования профиля.
 * Обновляет содержимое профиля и закрывает попап.
 */
function handleEditProfileSubmit (e) {
    e.preventDefault();
    profileTitle.textContent = profileNameInput.value;
    profileDescription.textContent = profileDescriptionInput.value;
    closePopup(editProfilePopup);
}

formEditProfile.addEventListener('submit', handleEditProfileSubmit);


// Обработчик кнопки открытия попапа добавления карточки
popupAddCardButton.addEventListener('click', () => {
    openPopup(addCardPopup);
})

/**
 * Обработчик отправки формы добавления карточки.
 * Создаёт и добавляет карточку в начало списка.
 */
function handleAddCardSubmit(e) {
    e.preventDefault();
    const cardData = {
        name: placeNameInput.value,
        link: placeLinkInput.value
    }
    placesCardList.prepend(createCard(cardData, deleteCard, addLike, deleteLike, handleCardImageClick));
    closePopup(addCardPopup);
}

formAddCard.addEventListener('submit', handleAddCardSubmit);


// Закрытие попапов по кнопке закрытия
popupCloseButtons.forEach((button) => {
    button.addEventListener('click', () => {
        closePopup(button.closest('.popup'));
    })
})

// Функции

/**
 * Создаёт DOM-элемент карточки на основе шаблона и переданных данных.
 * @param {Object} cardData - Данные карточки.
 * @param {string} cardData.name - Заголовок карточки.
 * @param {string} cardData.link - Ссылка на изображение.
 * @param {Function} deleteFunction - Функция удаления карточки.
 * @param {Function} addLike - Функция добавления лайка.
 * @param {Function} deleteLike - Функция удаления лайка.
 * @param {Function} handleCardImageClick - Обработчик клика по изображению карточки.
 * @returns {HTMLElement} Готовый элемент карточки.
 */
function createCard(cardData, deleteFunction, addLike, deleteLike, handleCardImageClick) {

    // Шаблон карточки
    const cardItem = cardTemplate.querySelector('.card').cloneNode(true);

    // Кнопка удаления карточки
    const deleteButton = cardItem.querySelector('.card__delete-button');

    // Кнопка лайка
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

    // Название карточки
    cardItem.querySelector('.card__title').textContent = cardData.name;

    // Заполнение атрибутов картинки
    Object.assign(cardImage, {
        src: cardData.link,
        alt: cardData.name,
    })

    // Возвращает заполненную карточку
    return cardItem;
}

/**
 * Обработчик клика по карточке.
 * Копирует src и alt картинки карточки в картинку попапа.
 * Копирует заголовок карточки в текст попапа
 * @param {HTMLElement} card - Элемент карточки.
 */
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

/**
 * Удаляет карточку из DOM.
 * @param {HTMLElement} element - Карточка.
 */
function deleteCard(element) {
    element.remove();
}

/**
 * Инициализация начальных карточек.
 * Перебирает массив с данными карточек,
 * передаёт данные карточек в функцию создания карточки
 */
initialCards.forEach((item) => {

// Добавляет на страницу список заполненных карточек
    placesCardList.append(createCard(item, deleteCard, addLike, deleteLike, handleCardImageClick));
})