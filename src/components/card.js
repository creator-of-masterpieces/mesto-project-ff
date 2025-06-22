/**
 * Card module for Mesto project
 * ---------------------------------
 * Отвечает за создание карточек, переключение лайков и удаление DOM‑элемента.
 * Сетевые запросы на лайк/дизлайк приходят из api.js; сам модуль остаётся
 * «глупым» и занимается только UI‑состоянием.
 */

import { likeCardRequest, deleteLikeRequest } from './api.js';

/**
 * Шаблон карточки хранится в <template id="card-template"> в HTML.
 * Клонируем его один раз на каждую карточку.
 * @type {HTMLTemplateElement}
 */
const cardTemplate = document.querySelector('#card-template').content;

/**
 * Генерирует DOM‑элемент карточки.
 * @param {{
 *   _id:string,
 *   name:string,
 *   link:string,
 *   likes:Array<{_id:string}>,
 *   owner:{_id:string}
 * }} cardData   – данные из API
 * @param {string} currentUserId           – ID текущего пользователя
 * @param {(id:string, el:HTMLElement)=>void} deleteFunction – коллбек удаления
 * @param {(cardEl:HTMLElement)=>void} handleCardImageClick  – открыть полноэкранное изображение
 * @param {(btn:HTMLButtonElement)=>void} handleLikeButtonClick – визуально переключить лайк
 * @returns {HTMLElement}
 */
export function createCard(cardData, currentUserId, deleteFunction, handleCardImageClick, handleLikeButtonClick) {
    const cardItem = cardTemplate.querySelector('.card').cloneNode(true);

    // DOM‑части карточки
    const deleteButton = cardItem.querySelector('.card__delete-button');
    const likeButton = cardItem.querySelector('.card__like-button');
    const likeCounter = cardItem.querySelector('.card__like-count');
    const cardImage = cardItem.querySelector('.card__image');
    const cardTitle = cardItem.querySelector('.card__title');

    // Наполняем контентом
    cardTitle.textContent = cardData.name;
    Object.assign(cardImage, { src: cardData.link, alt: cardData.name });
    likeCounter.textContent = cardData.likes.length;

    // Отображаем активный лайк, если пользователь уже лайкнул
    if (cardData.likes.some((like) => like._id === currentUserId)) {
        likeButton.classList.add('card__like-button_is-active');
    }

    // Скрываем корзину, если карточка чужая
    if (cardData.owner._id !== currentUserId) {
        deleteButton.style.display = 'none';
    }

    // ───────────────────────────── listeners

    // Удаление карточки после подтверждения во внешнем попапе
    deleteButton.addEventListener('click', () => deleteFunction(cardData._id, cardItem));

    // Переключение лайка
    likeButton.addEventListener('click', () => {
        const request = likeButton.classList.contains('card__like-button_is-active')
            ? deleteLikeRequest
            : likeCardRequest;

        request(cardData._id)
            .then((updated) => {
                handleLikeButtonClick(likeButton); // визуальное состояние
                likeCounter.textContent = updated.likes.length; // обновляем счётчик
            })
            .catch(console.error);
    });

    // Открытие полноэкранного попапа
    cardImage.addEventListener('click', () => handleCardImageClick(cardItem));

    return cardItem;
}

/**
 * Визуально переключает состояние кнопки лайка.
 * Не трогает сервер — только DOM.
 * @param {HTMLButtonElement} button
 */
export function handleLikeButtonClick(button) {
    button.classList.toggle('card__like-button_is-active');
}

/**
 * Полностью удаляет карточку из DOM.
 * @param {HTMLElement} element
 */
export function deleteCard(element) {
    element.remove();
}
