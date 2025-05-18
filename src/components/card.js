/**
 * Добавляет «лайк» карточке, присваивая кнопке класс
 * `card__like-button_is-active`.
 *
 * @param {HTMLElement} element — DOM-элемент кнопки «лайка».
 *                                Предполагается, что это кнопка
 *                                с классом `.card__like-button`.
 * @returns {void}
 */
function addLike(element) {
    element.classList.add('card__like-button_is-active');
}

/**
 * Удаляет «лайк» у карточки, убирая у кнопки класс
 * `card__like-button_is-active`.
 *
 * @param {HTMLElement} element — DOM-элемент кнопки «лайка».
 *                                Предполагается, что это кнопка
 *                                с классом `.card__like-button`.
 * @returns {void}
 */
function deleteLike(element) {
    element.classList.remove('card__like-button_is-active');
}

export {addLike, deleteLike};