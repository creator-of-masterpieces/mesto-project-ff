// Записал в переменную $ вызов метода querySelector, привязанного к объекту document
const $ = document.querySelector.bind(document);

// Записал список карточек в переменную placesList
const placesList = $('.places__list');

// Сохраняю шаблон карточки
const cardTemplate = $('#card-template');

//Функция создания карточки
function createCard(cardData) {

// Копирую содержимое шаблона карточки
    const cardItem = cardTemplate.content.cloneNode(true);


// Сохраняю кнопку удаления карточки
    const deleteButton = cardItem.querySelector('.card__delete-button');


// Добавляю обработчик клика на кнопку удаления карточки
    deleteButton.addEventListener('click', () => {
        deleteCard(cardItem);
    });



// Задаю текст заголовка карточки
    cardItem.querySelector('.card__title').textContent = cardData.name;

// Задаю значение атрибутов картинки
    Object.assign(cardItem.querySelector('.card__image'), {
        src: cardData.link,
        alt: cardData.name,
    })

// Ворзвращаю заполненную карточку
    return cardItem;
}

//Функция удаления карточек
function deleteCard(element) {
    element.closest('.card').remove();
}

// Передаю элементы массива с информацией о карточках в функцию создания карточки
initialCards.forEach((item) => {

// Добавляю на страницу список заполненных карточек
    placesList.append(createCard(item));
})


// @todo: Функция удаления карточки