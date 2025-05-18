// Функция открытия попапа.
// Добавляет элементу класс popup_is-opened.
// Добавляет обработчик клавиши Esc

function openPopup(element) {
    element.classList.add('popup_is-opened');
    document.addEventListener('keydown', handleEscape);
}

// Функция закрытия попапа.
// Удаляет у элемента класс popup_is-opened.
// Удаляет обработчик клавиши Esc

function closePopup(element) {
    element.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', handleEscape);
}

// При нажатии клавиши Esc вызывает функцию закрытия попапа

function handleEscape (e) {
    if (e.key === 'Escape') {
        const openedPopup = document.querySelector('.popup_is-opened');
        closePopup(openedPopup);
    }
}

export {openPopup, closePopup};