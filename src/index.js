/**
 * Entry‑point of the Mesto SPA
 * ============================
 * Подключает все вспомогательные модули, навешивает слушатели,
 * инициализирует состояние приложения и отвечает за high‑level
 * пользовательские сценарии.
 *
 * Импортируемые сущности:
 * • card.js – фабрика карточек и связанные хелперы (лайк, удаление)
 * • modal.js – открытие/закрытие попапов + overlay‑handler
 * • api.js – все сетевые запросы
 * • validation.js – валидация форм
 * • index.css – базовые стили (веб‑пак соберёт самостоятельно)
 */

// ────────────────────────────────────────────────────────────────
// 1. Импорты
// ────────────────────────────────────────────────────────────────
import { createCard, deleteCard, handleLikeButtonClick } from './components/card.js';
import { openPopup, closePopup, addOverlayClickHandler } from './components/modal.js';
import './pages/index.css';
import {
    getProfileData,
    sendProfileData,
    getCards,
    sendCard,
    deleteCardRequest,
    sendAvatarData,
} from './components/api';
import { enableValidation, clearValidation } from './components/validation.js';

// ────────────────────────────────────────────────────────────────
// 2. Утилиты DOM
// ────────────────────────────────────────────────────────────────
export const $ = document.querySelector.bind(document); // однократный поиск
export const $$ = document.querySelectorAll.bind(document); // nodelist‑коллекция

// ────────────────────────────────────────────────────────────────
// 3. DOM‑селекторы / переменные состояния
// ────────────────────────────────────────────────────────────────
const placesCardList = $('.places__list');
const popupEditButton = $('.profile__edit-button');
const popupAddCardButton = $('.profile__add-button');
const popupCloseButtons = $$('.popup__close');
const profileTitle = $('.profile__title');
const profileDescription = $('.profile__description');
const profileAvatar = $('.profile__image');

// Попап‑контейнеры
const popups = $$('.popup');
const editProfilePopup = $('.popup_type_edit');
const addCardPopup = $('.popup_type_new-card');
const popupCardImage = $('.popup_type_image');
const popupDeleteCard = $('.popup_type_delete-card');
const changeAvatarPopup = $('.popup_type_update-avatar');

// Кнопка подтверждения удаления
const buttonConfirmPopupDeleteCard = popupDeleteCard.querySelector('.popup__button');

// Данные удаляемой карточки (храним до подтверждения)
let doomedCardID = null;
let doomedCardElement = null;

// Текущий пользователь
let currentUserId;

// ────────────────────────────────────────────────────────────────
// 4. Формы и их элементы
// ────────────────────────────────────────────────────────────────
const formEditProfile = document.forms['edit-profile'];
const profileNameInput = formEditProfile.elements['profile-name'];
const profileDescriptionInput = formEditProfile.elements['description'];

const formAddCard = document.forms['new-place'];
const placeNameInput = formAddCard.elements['place-name'];
const placeLinkInput = formAddCard.elements['link'];

const formChangeAvatar = document.forms['new-avatar'];
const avatarLinkInput = formChangeAvatar.elements['link'];

// Конфиг валидатора (переиспользуется во всех формах)
const validationConfig = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible',
};

// Кнопки сабмита (нужны для display «Сохранение…»)
const submitButtonEditProfile = formEditProfile.querySelector(validationConfig.submitButtonSelector);
const submitButtonAddCard = formAddCard.querySelector(validationConfig.submitButtonSelector);
const submitButtonChangeAvatar = formChangeAvatar.querySelector(validationConfig.submitButtonSelector);

// ────────────────────────────────────────────────────────────────
// 5. Логика: API → UI
// ────────────────────────────────────────────────────────────────

/**
 * Получает профиль с сервера и пишет его в DOM.
 * Вызывается один раз при старте.
 */
function setProfileData() {
    getProfileData()
        .then((data) => {
            profileTitle.textContent = data.name;
            profileDescription.textContent = data.about;
            profileAvatar.style.backgroundImage = `url(${data.avatar})`;
            currentUserId = data._id;
        })
        .catch((error) => handleApiError(error, 'Не удалось загрузить профиль пользователя'));
}

/**
 * UI‑helper: показывает «Сохранение…» на кнопке сабмита.
 */
function renderLoading(isLoading, button, defaultText = 'Сохранить') {
    button.textContent = isLoading ? 'Сохранение…' : defaultText;
}

/**
 * Унифицированный вывод ошибок API.
 */
function handleApiError(error, userMessage = 'Что‑то пошло не так') {
    /* eslint‑disable no‑alert */
    console.error(userMessage, error);
    alert(userMessage);
}

// ────────────────────────────────────────────────────────────────
// 6. Handlers (обработчики событий)
// ────────────────────────────────────────────────────────────────

/**
 * Открывает попап редактирования профиля и префилл‑ит текущие значения.
 */
function handleEditButtonClick() {
    profileNameInput.value = profileTitle.textContent;
    profileDescriptionInput.value = profileDescription.textContent;
    clearValidation(formEditProfile, validationConfig);
    openPopup(editProfilePopup);
}

/**
 * submit → PATCH /users/me → обновляем DOM и закрываем попап.
 */
function handleEditProfileSubmit(evt) {
    evt.preventDefault();
    renderLoading(true, submitButtonEditProfile);
    const profileData = {
        name: profileNameInput.value,
        about: profileDescriptionInput.value,
    };

    sendProfileData(profileData)
        .then((data) => {
            profileTitle.textContent = data.name;
            profileDescription.textContent = data.about;
            closePopup(editProfilePopup);
        })
        .catch((error) => handleApiError(error, 'Не удалось обновить профиль'))
        .finally(() => {
            renderLoading(false, submitButtonEditProfile);
        });
}

/**
 * submit → POST /cards → prepend карточку в список.
 */
function handleAddCardSubmit(evt) {
    evt.preventDefault();
    renderLoading(true, submitButtonAddCard);

    const cardDraft = {
        name: placeNameInput.value,
        link: placeLinkInput.value,
    };

    sendCard(cardDraft)
        .then((card) => {
            placesCardList.prepend(createCard(card, currentUserId, prepareDelete, handleCardImageClick, handleLikeButtonClick));
            formAddCard.reset();
            clearValidation(formAddCard, validationConfig);
            closePopup(addCardPopup);
        })
        .catch((error) => handleApiError(error, 'Не удалось добавить карточку'))
        .finally(() => {
            renderLoading(false, submitButtonAddCard);
        });
}

/**
 * submit → PATCH /avatar → меняем фон‑картинку аватара.
 */
function handleChangeAvatarSubmit(evt) {
    evt.preventDefault();
    renderLoading(true, submitButtonChangeAvatar);

    sendAvatarData(avatarLinkInput.value)
        .then((profile) => {
            profileAvatar.style.backgroundImage = `url(${profile.avatar})`;
            formChangeAvatar.reset();
            clearValidation(formChangeAvatar, validationConfig);
            closePopup(changeAvatarPopup);
        })
        .catch((error) => handleApiError(error, 'Не удалось обновить аватар'))
        .finally(() => {
            renderLoading(false, submitButtonChangeAvatar);
        });
}

/**
 * Клик по иконке урны на карточке → спрашиваем подтверждение.
 */
function prepareDelete(id, cardElement) {
    doomedCardID = id;
    doomedCardElement = cardElement;
    openPopup(popupDeleteCard);
}

// Подтверждение удаления
buttonConfirmPopupDeleteCard.addEventListener('click', () => {
    deleteCardRequest(doomedCardID)
        .then(() =>{
            deleteCard(doomedCardElement);
            closePopup(popupDeleteCard);
        })
        .catch((error) => handleApiError(error, 'Ошибка при удалении карточки'))
});

/**
 * Клик по картинке карточки → открываем попап‑просмотр.
 */
function handleCardImageClick(card) {
    const cardImage = card.querySelector('.card__image');
    const cardTitle = card.querySelector('.card__title');
    const imagePopup = popupCardImage.querySelector('.popup__image');
    const textPopup = popupCardImage.querySelector('.popup__caption');

    textPopup.textContent = cardTitle.textContent;
    Object.assign(imagePopup, { src: cardImage.src, alt: cardImage.alt });
    openPopup(popupCardImage);
}

// Закрытие попапа по клику на крестик
popupCloseButtons.forEach((btn) => btn.addEventListener('click', () => closePopup(btn.closest('.popup'))));

// Клик по оверлею → закрыть
popups.forEach(addOverlayClickHandler);

// Кнопки «плюс» и «аватар»
popupAddCardButton.addEventListener('click', () => {
    formAddCard.reset();
    clearValidation(formAddCard, validationConfig);
    openPopup(addCardPopup);
});

profileAvatar.addEventListener('click', () => {
    formChangeAvatar.reset();
    clearValidation(formChangeAvatar, validationConfig);
    openPopup(changeAvatarPopup);
});

popupEditButton.addEventListener('click', handleEditButtonClick);
formEditProfile.addEventListener('submit', handleEditProfileSubmit);
formAddCard.addEventListener('submit', handleAddCardSubmit);
formChangeAvatar.addEventListener('submit', handleChangeAvatarSubmit);

// ────────────────────────────────────────────────────────────────
// 7. Bootstrap
// ────────────────────────────────────────────────────────────────

// 7.1. Загружаем карточки и профиль параллельно
Promise.all([getCards(), getProfileData()])
    .then(([cards, profile]) => {
        currentUserId = profile._id;
        profileTitle.textContent = profile.name;
        profileDescription.textContent = profile.about;
        profileAvatar.style.backgroundImage = `url(${profile.avatar})`;

        cards.forEach((card) => {
            placesCardList.append(createCard(card, currentUserId, prepareDelete, handleCardImageClick, handleLikeButtonClick));
        });
    })
    .catch((error) => handleApiError(error, 'Ошибка инициализации'));

// 7.2. Включаем валидацию
enableValidation(validationConfig);
