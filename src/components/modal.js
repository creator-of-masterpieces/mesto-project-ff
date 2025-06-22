/**
 * Modal helpers for Mesto project
 * --------------------------------
 * Управляет открытием/закрытием попап‑окон, добавляет обработчики
 * клавиши Escape и клика по оверлею. Все функции чистые: принимают
 * DOM‑элемент попапа и ничего не знают о внутренней разметке.
 */

/**
 * Открывает попап и вешает обработчик Escape.
 * @param {HTMLElement} popup – элемент с классом .popup
 */
export function openPopup(popup) {
    popup.classList.add('popup_is-opened');
    document.addEventListener('keydown', handleEscape);
}

/**
 * Закрывает попап и снимает обработчик Escape.
 * @param {HTMLElement} popup – тот же элемент, что открывали
 */
export function closePopup(popup) {
    popup.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', handleEscape);
}

/**
 * Закрывает открытую модалку по Esc.
 * @param {KeyboardEvent} evt
 * @private
 */
function handleEscape(evt) {
    if (evt.key === 'Escape') {
        const opened = document.querySelector('.popup_is-opened');
        if (opened) closePopup(opened);
    }
}

/**
 * Навешивает закрытие по клику на overlay.
 * @param {HTMLElement} popup – элемент pop‑up'а
 */
export function addOverlayClickHandler(popup) {
    popup.addEventListener('click', (evt) => {
        if (evt.target === evt.currentTarget) {
            closePopup(popup);
        }
    });
}
