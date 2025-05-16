

// Импорты

// Импорт JS
import './components/card.js';
import './components/modal.js';
import initialCards from './components/cards.js';

// Импорт CSS
import './pages/index.css';

// Забиндил поиск элемента в DOM
const $ = document.querySelector.bind(document);


// Переменные

// Сохраняю шаблон карточки
const cardTemplate = $('#card-template').content;

// Записал список карточек
const placesCardList = $('.places__list');


// Функции

// Функция создания карточки
// принимает данные для заполнения карточки и функцию удаления карточки
function createCard(cardData, deleteFunction) {

// Копирует шаблон карточки
    const cardItem = cardTemplate.querySelector('.card').cloneNode(true);

// Кнопка удаления карточки
    const deleteButton = cardItem.querySelector('.card__delete-button');

// Картинка карточки
    const cardImage = cardItem.querySelector('.card__image');

// Слушатель кнопки удаления карточки
    deleteButton.addEventListener('click', () => {
        deleteFunction(cardItem);
    });

// Записывает заголовок карточки
    cardItem.querySelector('.card__title').textContent = cardData.name;

// Записывает ссылку и альт. текст картинки карточки
    Object.assign(cardImage, {
        src: cardData.link,
        alt: cardData.name,
    })

// Возвращает заполненную карточку
    return cardItem;
}

// Функция удаления карточек
// Принимает карточку
function deleteCard(element) {
    element.remove();
}

// Перебирает массив с данными карточек,
// передаёт данные карточек в функцию создания карточки
initialCards.forEach((item) => {

// Добавляет на страницу список заполненных карточек
placesCardList.append(createCard(item, deleteCard));
})