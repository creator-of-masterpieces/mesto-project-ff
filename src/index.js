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
import {getProfileData, sendProfileData, getCards, sendCard, deleteCardRequest, sendAvatarData} from "./components/api";
import {enableValidation, clearValidation} from './components/validation.js';

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

// Аватар профиля
const profileAvatar = $('.profile__image');

// Попапы и элементы попапов
const popups = document.querySelectorAll('.popup');
const editProfilePopup = $('.popup_type_edit');
const addCardPopup = $('.popup_type_new-card');
const popupCardImage = $('.popup_type_image');
const popupDeleteCard = $('.popup_type_delete-card');
const changeAvatarPopup = $('.popup_type_update-avatar');
const buttonConfirmPopupDeleteCard = popupDeleteCard.querySelector('.popup__button');

// Попап подтверждения удаления карточки
const deleteCardPopup = document.querySelector('.popup_type_delete-card');

// Данные удаляемой карточки
let doomedCardID = null;
let doomedCardElement = null;

// Идентификатор текущего пользователя
let currentUserId;

// Формы
// Форма редактирования профиля
const formEditProfile = document.forms['edit-profile'];

// input с именем пользователя формы редактирования профиля
const profileNameInput = formEditProfile.elements['profile-name'];

// input с профессией пользователя формы редактирования профиля
const profileDescriptionInput = formEditProfile.elements['description'];

// Форма добавления карточки
const formAddCard = document.forms['new-place'];

// Текстовое поле с названием места формы добавления карточки
const placeNameInput = formAddCard.elements['place-name'];

// Текстовое поле со ссылкой на картинку формы добавления карточки
const placeLinkInput = formAddCard.elements['link'];

// Форма обновления аватара
const formChangeAvatar = document.forms['new-avatar'];

// Поле со ссылкой на аватар
const avatarLinkInput = formChangeAvatar.elements['link'];

const validationConfig = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
};


// Функции

// Принимает объект с данными профиля пользователя.
// Устанавливает имя и описание профиля
function setProfileData() {
    getProfileData()
        .then((data) => {
            profileTitle.textContent = data.name;
            profileDescription.textContent = data.about;
            profileAvatar.style.backgroundImage = `url(${data.avatar})`;
            currentUserId = data._id;
        })
        .catch((error) => {
            handleApiError(error, 'Не удалось загрузить профиль пользователя');
        })
}

/**
 * Обработчик клика кнопки редактирования профиля.
 *
 * При клике:
 * - Подставляет текущие значения имени и описания профиля
 *   в соответствующие поля формы.
 * - Открывает попап с формой редактирования профиля.
 */
function handleEditButtonClick() {
    profileNameInput.value = profileTitle.textContent;
    profileDescriptionInput.value = profileDescription.textContent;
    clearValidation(formEditProfile, validationConfig);
    openPopup(editProfilePopup);
}

/**
 * Обработчик отправки формы редактирования профиля.
 * Обновляет содержимое профиля и закрывает попап.
 * @param {Event} e - Объект события отправки формы.
 */
function handleEditProfileSubmit(e) {
    e.preventDefault();
    const profileData = {
        name: profileNameInput.value,
        about: profileDescriptionInput.value
    }
    sendProfileData(profileData)
        .then((profileData) => {
            profileTitle.textContent = profileData.name;
            profileDescription.textContent = profileData.about;
        })
        .catch((error) => {
            handleApiError(error, 'Не удалось обновить профиль');
        })
    closePopup(editProfilePopup);
}

// Обработчик ошибки обмена данных с сервером
function handleApiError(error, userMessage = 'Что-то пошло не так') {
    console.log(`${userMessage} ${error}`);
    alert(`${userMessage}`);
}

/**
 * Обработчик отправки формы добавления карточки.
 * Создаёт и добавляет карточку в начало списка.
 * @param {Event} e - Объект события отправки формы.
 */
function handleAddCardSubmit(e) {
    e.preventDefault();

    // Собирает данные пользователя
    const cardDraft = {
        name: placeNameInput.value,
        link: placeLinkInput.value
    }

    // Отправляет данные на сервер
    sendCard(cardDraft)
        .then((cardFromServer) => {
            const newCard = createCard(cardFromServer, currentUserId, prepareDelete, handleCardImageClick, handleLikeButtonClick);
            placesCardList.prepend(newCard);
            formAddCard.reset();
            clearValidation(formAddCard, validationConfig);
            closePopup(addCardPopup);
        })
        .catch((error) => {
            handleApiError(error, 'Не удалось добавить карточку');
        })
}

// Обработчик отправки формы обновления аватара
function handleChangeAvatarSubmit(e) {
    e.preventDefault();
    sendAvatarData(avatarLinkInput.value)
        .then((profile) => {
            profileAvatar.style.backgroundImage = `url(${profile.avatar})`;
            formChangeAvatar.reset();
            clearValidation(formChangeAvatar, validationConfig);
            closePopup(changeAvatarPopup);
        })
        .catch((error) => {
            handleApiError(error, 'Не удалось обновить аватар');
        })
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

// Обработчик клика на иконку удаления карточки (внутри карточки)
function prepareDelete(id, card) {
    doomedCardID = id;
    doomedCardElement = card;
    openPopup(deleteCardPopup);
}


// Обработчик клика на кнопку подтверждения попапа удаления карточки
buttonConfirmPopupDeleteCard.addEventListener('click', () => {
    deleteCardRequest(doomedCardID)
        .then(()=>{
            deleteCard(doomedCardElement);
        })
        .catch((err) => {
            handleApiError(err, 'Ошибка при удалении карточки');
        })
        .finally(() => {
            closePopup(popupDeleteCard);
        })
})


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
formChangeAvatar.addEventListener('submit', handleChangeAvatarSubmit);
popupAddCardButton.addEventListener('click', () => {
    clearValidation(formAddCard, validationConfig);
    formAddCard.reset();
    openPopup(addCardPopup);
});

profileAvatar.addEventListener('click', () => {
    clearValidation(formChangeAvatar, validationConfig);
    formChangeAvatar.reset();
    openPopup(changeAvatarPopup);
})

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
getCards()
    .then((cards) => {
        cards.forEach((item) => {
            // Добавляет на страницу список заполненных карточек
            placesCardList.append(createCard(item, currentUserId, prepareDelete, handleCardImageClick, handleLikeButtonClick));
        });
    })

// Получает данные профиля с сервера и устанавливает их
setProfileData();

enableValidation(validationConfig);



