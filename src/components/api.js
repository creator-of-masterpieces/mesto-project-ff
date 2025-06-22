/**
 * API helper module for Mesto project
 * ----------------------------------
 * Все функции обращаются к REST‑серверу Яндекс Практикума и
 * возвращают промисы, резолвящиеся готовыми JS‑объектами или
 * реджектящиеся c сообщением об ошибке. Добавлен JSDoc, чтобы при
 * импорте в редакторе сразу видеть сигнатуры и типы.
 */

/**
 * Глобальная конфигурация HTTP‑клиента.
 * @type {{baseURL: string, headers: {[k: string]: string}}}
 */
const config = {
    baseURL: 'https://nomoreparties.co/v1/wff-cohort-40',
    headers: {
        /** Токен авторизации, выдаётся в Практикуме */
        authorization: 'a8747f66-522a-45b2-ab1a-dc8d903fb7d7',
        /** Сообщаем серверу, что тело запроса — JSON */
        'content-type': 'application/json',
    },
};

/**
 * Проверяет HTTP‑ответ: если статус не 2xx — реджект.
 * Вынос в отдельную функцию избавляет от копипаста в каждом fetch.
 * @param {Response} res
 * @returns {Promise<any>} — данные из ответа
 */
const checkResponse = (res) => {
    if (!res.ok) {
        return Promise.reject(new Error(`Ошибка ${res.status}`));
    }
    return res.json();
};

// ────────────────────────────────────────────────────────────────
// Profile
// ────────────────────────────────────────────────────────────────

/**
 * Загружает данные текущего пользователя.
 * @returns {Promise<Object>} — объект профиля
 */
export const getProfileData = () =>
    fetch(`${config.baseURL}/users/me`, { headers: config.headers })
        .then(checkResponse);

/**
 * Отправляет новые «имя» и «о себе» на сервер.
 * @param {{name: string, about: string}} profileData
 */
export const sendProfileData = (profileData) =>
    fetch(`${config.baseURL}/users/me`, {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify(profileData),
    }).then(checkResponse);

/**
 * Меняет аватар пользователя.
 * @param {string} avatarUrl — абсолютный URL изображения
 */
export const sendAvatarData = (avatarUrl) =>
    fetch(`${config.baseURL}/users/me/avatar`, {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({ avatar: avatarUrl }),
    }).then(checkResponse);

// ────────────────────────────────────────────────────────────────
// Cards
// ────────────────────────────────────────────────────────────────

/**
 * Получает все карточки.
 */
export const getCards = () =>
    fetch(`${config.baseURL}/cards`, { headers: config.headers })
        .then(checkResponse);

/**
 * Создаёт новую карточку.
 * @param {{name: string, link: string}} cardData
 */
export const sendCard = (cardData) =>
    fetch(`${config.baseURL}/cards`, {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify(cardData),
    }).then(checkResponse);

/**
 * Удаляет карточку по ID.
 * @param {string} cardId
 */
export const deleteCardRequest = (cardId) =>
    fetch(`${config.baseURL}/cards/${cardId}`, {
        method: 'DELETE',
        headers: config.headers,
    }).then(checkResponse);

/**
 * Ставит лайк карточке.
 * @param {string} cardId
 */
export const likeCardRequest = (cardId) =>
    fetch(`${config.baseURL}/cards/${cardId}/likes`, {
        method: 'PUT',
        headers: config.headers,
    }).then(checkResponse);

/**
 * Снимает лайк с карточки.
 * @param {string} cardId
 */
export const deleteLikeRequest = (cardId) =>
    fetch(`${config.baseURL}/cards/${cardId}/likes`, {
        method: 'DELETE',
        headers: config.headers,
    }).then(checkResponse);
