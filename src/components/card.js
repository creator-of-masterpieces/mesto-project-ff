import {likeCardRequest, deleteLikeRequest} from './api.js';
//  Шаблон карточки
const cardTemplate = document.querySelector('#card-template').content;

// ID залогиненого пользователя
const userID = 'b0fa12586f9c92b90c172212';

/**
 * Создаёт и возвращает DOM-элемент карточки на основе шаблона и переданных данных.
 * @param {Object} cardData - данные карточки от сервера.
 * @param {string} cardData.name - Заголовок карточки.
 * @param {string} cardData.link - Ссылка на изображение.
 * @param {string} currentUserId - идентификатор текущего пользователя.
 * @param {Function} deleteFunction - Функция удаления карточки.
 * @param {Function} handleCardImageClick - Открыть попап с большой картинкой.
 * @param {Function} handleLikeButtonClick - Поставить/убрать лайк.
 * @returns {HTMLElement} Готовый элемент карточки.
 */
function createCard(cardData,currentUserId, deleteFunction, handleCardImageClick, handleLikeButtonClick) {
    // Клонирование шаблона карточки
    const cardItem = cardTemplate.querySelector('.card').cloneNode(true);

    //Получение нужных элементов карточки

    // Название карточки
    cardItem.querySelector('.card__title').textContent = cardData.name;

    // Кнопка удаления карточки
    const deleteButton = cardItem.querySelector('.card__delete-button');

    // Кнопка лайка
    const likeButton = cardItem.querySelector('.card__like-button');

    // Счетчик лайков
    const likeCounter = cardItem.querySelector('.card__like-count');

    // Картинка карточки
    const cardImage = cardItem.querySelector('.card__image');

    // Данные карточки
    // Количество лайков полученное от сервера
    const likeCount = cardData.likes.length;

    // Помечает кнопку активной, если текущий пользователь уже ставил лайк
    if (cardData.likes.some((item) => item._id === currentUserId)) {
        likeButton.classList.add('card__like-button_is-active');
    }

    // Слушатель клика на кнопку удаления карточки.
    // Создает замыкание, благодаря чему при клике на кнопку удаления карточки удаляется именно карточка,
    // по которой был сделан клик
    deleteButton.addEventListener('click', () => {
        deleteFunction(cardData._id, cardItem);
    });

    // Слушатель клика на кнопку лайка карточки
    likeButton.addEventListener('click', () => {
        const currentButton = likeButton;
        let request;
        if(currentButton.classList.contains('.card__like-button_is-active')) {
            request = deleteLikeRequest;
        }
        else {
            request = likeCardRequest;
        }
        request(cardData._id)
            .then((updatedCard) => {
                handleLikeButtonClick(currentButton);
                likeCounter.textContent = updatedCard.likes.length;
            })
            .catch((err) => {
                console.error(err);
            })
    });

    // Слушатель клика на картинку карточки.
    // Вызывает обработчик клика, который показывает попап с большой картинкой
    cardImage.addEventListener('click', () => {
        handleCardImageClick(cardItem);
    });

    // Устанавливает количество лайков
    likeCounter.textContent = likeCount;

    // Заполнение атрибутов картинки
    Object.assign(cardImage, {
        src: cardData.link,
        alt: cardData.name,
    })

    // Проверяет владельца карточки и скрывает кнопку удаления у чужих карточек
    if(cardData.owner._id !== currentUserId) {
        deleteButton.style.display = 'none';
    }

    // Возвращает заполненную карточку
    return cardItem;
}

/**
 * Обработчик клика по кнопке лайка.
 * Переключает класс активности для кнопки лайка.
 * @param {HTMLElement} button - Кнопка лайка.
 */
function handleLikeButtonClick(button) {
    button.classList.toggle('card__like-button_is-active');

}

/**
 * Удаляет карточку из DOM.
 * @param {HTMLElement} element - Карточка.
 */
function deleteCard(element) {
    element.remove();
}

// Экспорт функций
export {deleteCard, createCard, handleLikeButtonClick};
