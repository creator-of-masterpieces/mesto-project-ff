# Mesto — Project FF

[**▶️ Live Demo (GitHub Pages)**](https://creator-of-masterpieces.github.io/mesto-project-ff/)

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white" alt="HTML5"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white" alt="CSS3"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/Deployed_on-GitHub_Pages-181717?style=flat&logo=github" alt="GitHub Pages"/>
</p>

> Интерактивный SPA‑сервис, где пользователи делятся карточками любимых мест, ставят лайки и редактируют профиль. Проект развивался поэтапно: от статической вёрстки до полноценного фронтенда с работой через REST API. Актуальная версия использует модульную архитектуру, строгую валидацию форм и асинхронный деплой в GitHub Pages.

---

## ⚙️ Технологии

|  Раздел     |  Стек                                   |
| ----------- | --------------------------------------- |
|  Язык       |  ES2023 (ES modules)                    |
|  Сборка     |  Webpack 5 + Babel                      |
|  Стили      |  CSS + BEM                              |
|  Валидация  |  HTML5 Validity API + кастомные ошибки  |
|  Запросы    |  `fetch` → REST API Яндекс Практикума   |
|  Деплой     |  `gh-pages` npm‑пакет                   |

---

## 🚀 Ключевые фичи

### 1. Модуль `api.js`

* Универсальная `checkResponse()` уничтожила копипасту `.then(res => res.ok ? res.json() : Promise.reject())`.
* JSDoc‑типизация всех запросов.
* Параллельная загрузка профиля и карточек через `Promise.all()` — страница готова быстрее.

### 2. Валидация форм (`validation.js`)

* Подсветка полей, вывод текстовых ошибок, блокировка кнопки «Сохранить».
* Сброс ошибок при повторном открытии попапа → чистый UX.

### 3. Карточки (`card.js`)

* Генерация из HTML `<template>` без лишних ререндеров.
* Мгновенный отклик на лайк — UI меняется до ответа сервера.
* Право на «корзину» только у владельца карточки.

### 4. Попапы (`modal.js`)

* Открытие/закрытие по Esc и клику на оверлей.
* Чистый DOM → нет утечек слушателей.

### 5. Сборка и деплой

* `npm run dev` — локальный сервер с HMR.
* `npm run build` — production‑сборка.
* `npm run deploy` — автопубликация в ветку **gh-pages**.

---

## 📂 Быстрый старт

```bash
# 1. Клонируем репозиторий
$ git clone https://github.com/creator-of-masterpieces/mesto-project-ff.git
$ cd mesto-project-ff

# 2. Ставим зависимости
$ npm i

# 3. Запускаем дев‑режим
$ npm run dev
# ➜ страница откроется на http://localhost:8080
```

Собрать production‑бандл:

```bash
$ npm run build
```

Развернуть на GitHub Pages:

```bash
$ npm run deploy
```

> **Важно**: перед первым `npm run deploy` убедитесь, что в **Settings → Pages** выбран источник ветка `gh-pages` / root.

---

## 🗂️ Структура проекта

```
├── src
│   ├── components
│   │   ├── api.js          # REST‑запросы
│   │   ├── card.js         # создание/лайк/удаление карточек
│   │   ├── modal.js        # pop‑up helpers
│   │   └── validation.js   # валидация форм
│   ├── pages
│   │   └── index.css       # глобальные стили
│   ├── index.js            # точка входа SPA
│   └── images/*.svg        # иконки
├── public                   # статические файлы
└── ...
```

---

## 🔗 REST API (wff‑cohort‑40)

|  Метод   |  Endpoint                |  Описание             |
| -------- | ------------------------ | --------------------- |
|  GET     |  `/users/me`             | получить профиль      |
|  PATCH   |  `/users/me`             | обновить имя/о себе   |
|  PATCH   |  `/users/me/avatar`      | сменить аватар        |
|  GET     |  `/cards`                | все карточки          |
|  POST    |  `/cards`                | новая карточка        |
|  DELETE  |  `/cards/:cardId`        | удалить свою карточку |
|  PUT     |  `/cards/:cardId/likes`  | лайк                  |
|  DELETE  |  `/cards/:cardId/likes`  | снять лайк            |

---

## 💡 TODO / планы

* Перевести проект на TypeScript (строгие типы + enum API путей).
* Добавить offline‑режим через Service Worker.
* Подключить CI (ESLint + Jest) в PR.

---

## 📝 Лицензия

MIT © 2025 `Димоооон`
