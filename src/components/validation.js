/**
 * Form‑validation utilities for Mesto project
 * ------------------------------------------
 * Добавляет HTML‑5 проверку полей, отображает кастомные ошибки и
 * динамически включает/выключает кнопку отправки. Все функции
 * экспортируются для переиспользования в любом попапе.
 */

/**
 * Показывает текст ошибки валидации рядом с полем и
 * визуально подсвечивает само поле.
 *
 * @param {HTMLFormElement} formElement   – форма, внутри которой ищем ошибку
 * @param {HTMLInputElement} inputElement – само поле ввода
 * @param {string} errorMessage           – человекочитаемый текст ошибки
 * @param {{inputErrorClass:string,errorClass:string}} config – CSS‑классы
 */
export function showInputError(formElement, inputElement, errorMessage, config) {
    // <span class="ИмяПоля-error"> — создаётся в разметке формы
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.add(config.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(config.errorClass);
}

/**
 * Скрывает сообщение об ошибке и удаляет стили, указывающие на невалидное состояние поля ввода.
 *
 * @param {HTMLFormElement} formElement - Форма, содержащая поле ввода.
 * @param {HTMLInputElement} inputElement - Поле ввода, с которого нужно снять ошибку.
 * @param {Object} config - Конфигурационный объект с CSS-классами.
 * @param {string} config.inputErrorClass - Класс, добавляемый невалидному инпуту.
 * @param {string} config.errorClass - Класс, делающий сообщение об ошибке видимым.
 *
 * Удаляет визуальные индикаторы ошибки с поля ввода:
 * - Убирает класс ошибки у input.
 * - Очищает текст ошибки.
 * - Сбрасывает кастомное сообщение об ошибке (если было установлено).
 * - Прячет элемент с сообщением об ошибке.
 */
export function hideInputError(formElement, inputElement, config) {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.remove(config.inputErrorClass);
    errorElement.textContent = '';
    inputElement.setCustomValidity('');
    errorElement.classList.remove(config.errorClass);
}

/**
 * Проверяет валидность одного поля и показывает / скрывает ошибку.
 * HTML‑5 даёт готовые проверки, но для patternMismatch хотим своё сообщение.
 * @private
 */
function checkInputValidity(formElement, inputElement, config) {
    if (inputElement.validity.patternMismatch) {
        // Сообщение берём прямо из data‑атрибута в HTML
        inputElement.setCustomValidity(inputElement.dataset.errorMessage);
    } else {
        inputElement.setCustomValidity('');
    }

    if (!inputElement.validity.valid) {
        showInputError(formElement, inputElement, inputElement.validationMessage, config);
    } else {
        hideInputError(formElement, inputElement, config);
    }
}

/**
 * Есть хотя бы одно невалидное поле?
 * @param {HTMLInputElement[]} inputList
 * @returns {boolean}
 */
function hasInvalidInput(inputList) {
    return inputList.some((inputElement) => !inputElement.validity.valid);
}

/**
 * Активирует или деактивирует кнопку отправки формы в зависимости от валидности всех полей ввода.
 *
 * @param {HTMLInputElement[]} inputList - Массив всех полей ввода формы, которые нужно проверить.
 * @param {HTMLButtonElement} buttonElement - Кнопка отправки, которую нужно включить или выключить.
 * @param {Object} config - Конфигурационный объект с CSS-классами.
 * @param {string} config.inactiveButtonClass - Класс, применяемый к неактивной (задизейбленной) кнопке.
 *
 * Логика работы:
 * - Если хотя бы одно поле ввода невалидно, кнопка:
 *     - получает CSS-класс для неактивного состояния;
 *     - становится недоступной (disabled).
 * - Если все поля валидны, кнопка:
 *     - лишается класса неактивности;
 *     - становится доступной для нажатия.
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
 * @private
 */
function setEventListeners(formElement, config) {
    const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
    const buttonElement = formElement.querySelector(config.submitButtonSelector);

    toggleButtonState(inputList, buttonElement, config); // стартовое состояние

    inputList.forEach((inputElement) => {
        inputElement.addEventListener('input', () => {
            checkInputValidity(formElement, inputElement, config);
            toggleButtonState(inputList, buttonElement, config);
        });
    });
}

/**
 * Главная функция‑инициализатор. Вызываем один раз на старте приложения.
 * Обходит все формы по селектору и подвязывает слушатели.
 *
 * @param {{
 *   formSelector:string,
 *   inputSelector:string,
 *   submitButtonSelector:string,
 *   inactiveButtonClass:string,
 *   inputErrorClass:string,
 *   errorClass:string
 * }} config – объект селекторов/классов
 */
export function enableValidation(config) {
    const formList = Array.from(document.querySelectorAll(config.formSelector));

    formList.forEach((formElement) => {
        // Блокируем стандартную отправку формы, чтобы SPA не перезагружался
        formElement.addEventListener('submit', (evt) => evt.preventDefault());
        setEventListeners(formElement, config);
    });
}

/**
 * Сбрасывает состояние ошибок и обновляет кнопку сабмита.
 * Удобно вызывать при открытии попапа.
 */
export function clearValidation(formElement, config) {
    const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
    const buttonElement = formElement.querySelector(config.submitButtonSelector);

    inputList.forEach((inputElement) => hideInputError(formElement, inputElement, config));
    toggleButtonState(inputList, buttonElement, config);
}
