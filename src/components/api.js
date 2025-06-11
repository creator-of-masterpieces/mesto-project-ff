const config = {
    baseURL:'https://nomoreparties.co/v1/wff-cohort-40',
    headers:{
        authorization: 'a8747f66-522a-45b2-ab1a-dc8d903fb7d7',
        'content-type': 'application/json'
    }
}

//  Загрузка данных профиля с сервера

const getProfileData = () => {
    return fetch(`${config.baseURL}/users/me`, {
        headers:{
            authorization: config.headers.authorization,
            'content-type': 'application/json'
        }
    })
        .then((res) => {
            if (!res.ok) {
                return Promise.reject(`Ошибка ${res.status}`);
            }
            return res.json();
        })
}

// Обновление данных профиля на сервере

const sendProfileData = (profileData) => {
    return fetch(`${config.baseURL}/users/me`, {
        method: 'PATCH',
        headers: {
            authorization: config.headers.authorization,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
    })
        .then((res) => {
            if (!res.ok) {
                return Promise.reject(`Ошибка ${res.status}`);
            }
            return res.json();
        })
}

export {getProfileData, sendProfileData};