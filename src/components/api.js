/**
 * Конфигурация для API-запросов.
 * Используется в проекте Mesto для обращения к серверу Яндекс Практикума.
 *
 * @constant
 * @type {Object}
 * @property {string} baseURL - Базовый URL API. Все запросы отправляются по этому адресу.
 * @property {Object} headers - Заголовки, отправляемые с каждым запросом.
 * @property {string} headers.authorization - Токен авторизации для доступа к API.
 * @property {string} headers['content-type'] - Тип контента, указывающий, что мы отправляем JSON.
 */
const config = {
    baseURL: 'https://nomoreparties.co/v1/wff-cohort-40',
    headers: {
        authorization: 'a8747f66-522a-45b2-ab1a-dc8d903fb7d7',
        'content-type': 'application/json',
    },
}

//  Загрузка данных профиля с сервера
const getProfileData = () => {
    return fetch(`${config.baseURL}/users/me`, {
        headers: {
            authorization: config.headers.authorization,
            'content-type': 'application/json',
        }
    })
        .then((res) => {
            if (!res.ok) {
                return Promise.reject(`Ошибка ${res.status}`);
            }
            return res.json();
        })
}

// Отправка обновленных данных профиля на сервер
const sendProfileData = (profileData) => {
    return fetch(`${config.baseURL}/users/me`, {
        method: 'PATCH',
        headers: {
            authorization: config.headers.authorization,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
    })
        .then((res) => {
            if (!res.ok) {
                return Promise.reject(`Ошибка ${res.status}`);
            }
            return res.json();
        })
}

// Загрузка карточек с сервера
const getCards = () => {
    return fetch(`${config.baseURL}/cards`, {
        headers: {
            authorization: config.headers.authorization,
            'content-type': 'application/json',
        }
    })
        .then((res) => {
            if (!res.ok) {
                console.log(res.status);
            }
            return res.json();
        })
}

// Загрузка на сервер новой карточки
const sendCard = (cardData) => {
    return fetch(`${config.baseURL}/cards`, {
        method: 'POST',
        headers: {
            authorization: config.headers.authorization,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cardData),
    })
        .then((res) => {
            return res.json();
        })
}

// Удаление карточки
const deleteCardRequest = (idCard) => {
    return fetch(`${config.baseURL}/cards/${idCard}`, {
        method: 'DELETE',
        headers: config.headers,
    })
        .then((res) => {
            if (!res.ok) {
                return Promise.reject(`Ошибка при удалении карточки: ${res.status}`)
            }
        })
        .catch((error) => {
            return Promise.reject(`Ошибка при удалении карточки: ${error}`)
        })
}

// Добавление лайка

const likeCardRequest = (cardID) => {
    return fetch(`${config.baseURL}/cards/${cardID}/likes`, {
        method: 'PUT',
        headers: config.headers,
    })
        .then((res) => {
            if(!res.ok) {
                return Promise.reject(`Ошибка ${res.status}`);
            }
            return res.json();
        })
}

// Удаление лайка

const deleteLikeRequest = (cardID) => {
    return fetch(`${config.baseURL}/cards/${cardID}/likes`, {
        method: 'DELETE',
        headers: config.headers,
    })
        .then((res) => {
            if(!res.ok) {
                return Promise.reject(`Ошибка ${res.status}`);
            }
            return res.json();
        })
}

// Отправка нового аватара на сервер
const sendAvatarData = (avatarUrl) => {
    return fetch(`${config.baseURL}/users/me/avatar`, {
        method: 'PATCH',
        headers: {
            authorization: config.headers.authorization,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({avatar: avatarUrl})
    })
        .then((res) => {
            if(!res.ok) {
                return Promise.reject(`Ошибка ${res.status}`);
            }
            return res.json();
        })
}
export {getProfileData, sendProfileData, getCards, sendCard, deleteCardRequest, likeCardRequest, deleteLikeRequest, sendAvatarData};