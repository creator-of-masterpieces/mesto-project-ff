
//  Принимает на вход элемент
//  добавляет элементу класс card__like-button_is-active

function addLike(element) {
    element.classList.add('card__like-button_is-active');
}

function deleteLike(element) {
    element.classList.remove('card__like-button_is-active');
}

export {addLike, deleteLike};