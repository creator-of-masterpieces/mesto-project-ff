const config = {
    baseURL:'https://nomoreparties.co/v1/wff-cohort-40',
    headers:{
        authorization: 'a8747f66-522a-45b2-ab1a-dc8d903fb7d7',
        'content-type': 'application/json'
    }
}

// Функция загрузки данных профиля
const getProfileData =  async ()=> {
    try {
        const res = await fetch (`${config.baseURL}`);
        // Проверка, если сервер вернул ошибку
        if(!res.ok) {
            throw new Error(`Ошибка: $(res.status)`);
        }
        // Распаковка ответа сервера
        const data = await res.json();
        console.log(data);
    }
    // Обработка ошибок, если что-то не так в try
    catch (error) {
        console.error('Что-то пошло не так:', error);
    }
}