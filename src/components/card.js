//  Шаблон карточки
const cardTemplate = document.querySelector('#card-template').content;

/**
 * Создаёт DOM-элемент карточки на основе шаблона и переданных данных.
 * @param {Object} cardData - Данные карточки.
 * @param {string} cardData.name - Заголовок карточки.
 * @param {string} cardData.link - Ссылка на изображение.
 * @param {Function} deleteFunction - Функция удаления карточки.
 * @param {Function} handleCardImageClick - Обработчик клика по изображению карточки.
 * @param {Function} handleLikeButtonClick - Обработчик клика по кнопке лайка.
 * @returns {HTMLElement} Готовый элемент карточки.
 */
function createCard(cardData, deleteFunction, handleCardImageClick, handleLikeButtonClick) {
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
    likeButton.addEventListener('click', (e) => {
        handleLikeButtonClick(e.currentTarget);
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

export {deleteCard, createCard, handleLikeButtonClick};
