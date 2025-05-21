/**
 * Открывает попап.
 * Добавляет элементу класс "popup_is-opened" для отображения.
 * Добавляет обработчик события нажатия клавиши Escape для закрытия попапа.
 *
 * @param {Element} element - DOM-элемент попапа для открытия.
 */
function openPopup(element) {
    element.classList.add('popup_is-opened');
    document.addEventListener('keydown', handleEscape);
}

/**
 * Закрывает попап.
 * Удаляет у элемента класс "popup_is-opened".
 * Удаляет обработчик события нажатия клавиши Escape.
 *
 * @param {Element} element - DOM-элемент попапа для закрытия.
 */
function closePopup(element) {
    element.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', handleEscape);
}

/**
 * Обработчик события нажатия клавиши Escape.
 *
 * @param {KeyboardEvent} e - Объект события клавиатуры.
 */
function handleEscape(e) {
    if (e.key === 'Escape') {
        const openedPopup = document.querySelector('.popup_is-opened');
        closePopup(openedPopup);
    }
}

/**
 * Добавляет обработчик закрытия попапа при клике на оверлей (фон попапа).
 * Если клик происходит по самому оверлею, попап закрывается.
 * @param {HTMLElement} popup - DOM-элемент попапа.
 */
function handleOverlayClick(popup) {
    popup.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            closePopup(popup);
        }
    })
}

export {openPopup, closePopup, handleOverlayClick};
