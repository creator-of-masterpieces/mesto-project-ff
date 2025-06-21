/**
 * Показывает текст ошибки валидации рядом с полем и
 * визуально подсвечивает само поле.
 *
 * @param {HTMLFormElement} formElement   – форма, внутри которой ищем ошибку
 * @param {HTMLInputElement} inputElement – само поле ввода
 * @param {string} errorMessage           – человекочитаемый текст ошибки
 * @param {Object} config                 – объект с CSS-классами и селекторами
 */
export function showInputError(formElement, inputElement, errorMessage, config) {
    // Находим <span class="ИмяПоля-error"> по соглашению «id + "-error"»
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    // Добавляем рамку/красный фон и т. д.
    inputElement.classList.add(config.inputErrorClass);
    // Пишем текст ошибки
    errorElement.textContent = errorMessage;
    // Делаем <span> видимым (например, opacity: 1)
    errorElement.classList.add(config.errorClass);
}

/**
 * Скрывает ошибку и убирает стилевые индикаторы с инпута.
 */
export function hideInputError(formElement, inputElement, config) {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.remove(config.inputErrorClass);
    errorElement.textContent = '';
    errorElement.classList.remove(config.errorClass);
}

/**
 * Проверяет валидность одного поля и показывает / скрывает ошибку.
 *
 * Почему не используем HTML5-валидацию напрямую?
 * – Нужно собственное сообщение (dataset.errorMessage) для patternMismatch.
 */
function checkInputValidity(formElement, inputElement, config) {
    // Если не совпадает regexp-pattern – подменяем стандартное сообщение
    if (inputElement.validity.patternMismatch) {
        inputElement.setCustomValidity(inputElement.dataset.errorMessage);
    } else {
        inputElement.setCustomValidity('');
    }
    // По итогам решаем: показать ошибку или спрятать
    if (!inputElement.validity.valid) {
        showInputError(formElement, inputElement, inputElement.validationMessage, config);
    } else {
        hideInputError(formElement, inputElement, config);
    }
}

/**
 * Есть хотя бы одно невалидное поле?
 * Используем метод some(), чтобы выйти при первой же ошибке – быстрее, чем every().
 */
function hasInvalidInput(inputList) {
    return inputList.some((inputElement) => !inputElement.validity.valid);
}

/**
 * Активирует/дизэйблит кнопку сабмита в зависимости от валидности формы.
 * Не верим пользователю на слово – смотрим на реальное состояние полей.
 */
function toggleButtonState(inputList, buttonElement, config) {
    if (hasInvalidInput(inputList)) {
        buttonElement.classList.add(config.inactiveButtonClass);
        buttonElement.setAttribute('disabled', true);
    } else {
        buttonElement.classList.remove(config.inactiveButtonClass);
        buttonElement.removeAttribute('disabled');
    }
}

/**
 * Вешает обработчики input на все поля формы
 * и сразу синхронизирует состояние кнопки.
 */
function setEventListeners(formElement, config) {
    const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
    const buttonElement = formElement.querySelector(config.submitButtonSelector);
    // Первый прогон — чтобы кнопка была верно отключена при открытии модалки
    toggleButtonState(inputList, buttonElement, config);

    // «Живое» обновление ошибок и кнопки при каждом вводе символа
    inputList.forEach((inputElement) => {
        inputElement.addEventListener('input', () => {
            checkInputValidity(formElement, inputElement, config);
            toggleButtonState(inputList, buttonElement, config);
        });
    });
}

/**
 * Главная функция-инициализатор. Вызываем один раз на старте приложения.
 *
 * @param {Object} config – те же селекторы и CSS-классы, что и выше.
 */
export function enableValidation(config) {
    const formList = Array.from(document.querySelectorAll(config.formSelector));

    formList.forEach((formElement) => {
        // Блокируем стандартную отправку формы, чтобы SPA не «перезагружался».
        formElement.addEventListener('submit', (evt) => {
            evt.preventDefault();
        });
        setEventListeners(formElement, config);
    });
}

/**
 * Полезно при открытии попапа редактирования, когда
 * нужно сбросить старые ошибки и обновить кнопку сабмита.
 */
export function clearValidation(formElement, config) {
    const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
    const buttonElement = formElement.querySelector(config.submitButtonSelector);

    inputList.forEach((inputElement) => {
        hideInputError(formElement, inputElement, config);
    });

    toggleButtonState(inputList, buttonElement, config);
}