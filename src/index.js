// Записал в переменную $ вызов метода querySelector, привязанного к объекту document
const $ = document.querySelector.bind(document);

// Сохраняю шаблон карточки
const cardTemplate = $('#card-template').content;

// Записал список карточек в переменную placesCardList
const placesCardList = $('.places__list');

//Функция создания карточки принимает данные для заполнения карточки и функцию удаления карточки
function createCard(cardData, deleteFunction) {

// Копирую содержимое шаблона карточки
    const cardItem = cardTemplate.querySelector('.card').cloneNode(true);

// Сохраняю кнопку удаления карточки
    const deleteButton = cardItem.querySelector('.card__delete-button');

// Сохраняю обложку карточки
    const cardImage = cardItem.querySelector('.card__image');

// Добавляю обработчик клика на кнопку удаления карточки
    deleteButton.addEventListener('click', () => {
        deleteFunction(cardItem);
    });

// Задаю текст заголовка карточки
    cardItem.querySelector('.card__title').textContent = cardData.name;

// Задаю значение атрибутов картинки
    Object.assign(cardImage, {
        src: cardData.link,
        alt: cardData.name,
    })

// Ворзвращаю заполненную карточку
    return cardItem;
}

//Функция удаления карточек
function deleteCard(element) {
    element.remove();
}

// Передаю элементы массива с информацией о карточках в функцию создания карточки
initialCards.forEach((item) => {

// Добавляю на страницу список заполненных карточек
placesCardList.append(createCard(item, deleteCard));
})