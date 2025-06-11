/**
 * Главный модуль приложения: подключает стили, модули, инициализирует интерфейс и взаимодействие.
 *
 * Импортирует:
 * - Функции управления лайками карточек
 * - Функции открытия и закрытия модальных окон
 * - Начальные данные карточек
 * - Основной CSS файл
 */

// 1. Импорты
import {createCard, deleteCard, handleLikeButtonClick} from './components/card.js';
import {openPopup, closePopup, addOverlayClickHandler} from './components/modal.js';
import './pages/index.css';
import initialCards from './components/cards.js';
import {getProfileData} from "./components/api";

// 2. Утилиты DOM: сокращения для document.querySelector и document.querySelectorAll
export const $ = document.querySelector.bind(document);
export const $$ = document.querySelectorAll.bind(document);

// 3. DOM-элементы и переменные

// Список карточек
const placesCardList = $('.places__list');

// Кнопка открытия попапа редактирования профиля
const popupEditButton = $('.profile__edit-button');

// Кнопка открытия попапа добавления карточки
const popupAddCardButton = $('.profile__add-button');

// Кнопки закрытия попапов
const popupCloseButtons = $$('.popup__close');

// Заголовок профиля
const profileTitle = $('.profile__title');

// Описание профиля
const profileDescription = $('.profile__description');

// Попапы
const popups = document.querySelectorAll('.popup');
const editProfilePopup = $('.popup_type_edit');
const addCardPopup = $('.popup_type_new-card');
const popupCardImage = $('.popup_type_image');

// Формы
// Форма редактирования профиля
const formEditProfile = document.forms['edit-profile'];

// input с именем пользователя формы редактирования профиля
const profileNameInput =  formEditProfile.elements['profile-name'];

// input с профессией пользователя формы редактирования профиля
const profileDescriptionInput =  formEditProfile.elements['description'];

// Форма добавления карточки
const formAddCard = document.forms['new-place'];

// Текстовое поле с названием места формы добавления карточки
const placeNameInput = formAddCard.elements['place-name'];

// Текстовое поле со ссылкой на картинку формы добавления карточки
const placeLinkInput = formAddCard.elements['link'];

// 4. Функции

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

/**
 * Обработчик отправки формы редактирования профиля.
 * Обновляет содержимое профиля и закрывает попап.
 * @param {Event} e - Объект события отправки формы.
 */
function handleEditProfileSubmit (e) {
    e.preventDefault();
    profileTitle.textContent = profileNameInput.value;
    profileDescription.textContent = profileDescriptionInput.value;
    closePopup(editProfilePopup);
}

/**
 * Обработчик отправки формы добавления карточки.
 * Создаёт и добавляет карточку в начало списка.
 * @param {Event} e - Объект события отправки формы.
 */
function handleAddCardSubmit(e) {
    e.preventDefault();
    const cardData = {
        name: placeNameInput.value,
        link: placeLinkInput.value
    }

    placesCardList.prepend(createCard(cardData, deleteCard, handleCardImageClick, handleLikeButtonClick));
    formAddCard.reset();
    closePopup(addCardPopup);
}

/**
 * Обработчик клика на кнопку закрытия.
 * @param {HTMLElement} button - Кнопка закрытия.
 */
function handleCardCloseButtonClick(button) {
    button.addEventListener('click', () => {
        closePopup(button.closest('.popup'));
    })
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



// 5. Слушатели событий
popupEditButton.addEventListener('click', handleEditButtonClick);
formEditProfile.addEventListener('submit', handleEditProfileSubmit);
formAddCard.addEventListener('submit', handleAddCardSubmit);
popupAddCardButton.addEventListener('click', () => {
    openPopup(addCardPopup);
});

// Вешает обработчик клика на кнопку закрытия
popupCloseButtons.forEach(handleCardCloseButtonClick);

// Вешает обработчик клика на оверлэй
popups.forEach(addOverlayClickHandler);

// 6. Инициализация
/**
 * Инициализация начальных карточек.
 * Перебирает массив с данными карточек,
 * передаёт данные карточек в функцию создания карточки
 */
initialCards.forEach((item) => {
    // Добавляет на страницу список заполненных карточек
    placesCardList.append(createCard(item, deleteCard, handleCardImageClick, handleLikeButtonClick));
});
