# Проектная работа «Stellar Burgers»

Приложение для заказа авторских бургеров: пользователь выбирает ингредиенты, собирает конструкцию, оформляет заказ и отслеживает статус. Личный кабинет позволяет управлять профилем и просматривать историю заказов.

Стек: React, Redux Toolkit, React Router DOM, TypeScript, Webpack, Jest, Playwright, Storybook

Структура проекта:

- `src/pages/` — страницы приложения
- `src/components/` — компоненты страниц
- `src/components/ui/pages/` — UI-версии страниц для Storybook
- `src/components/ui/` — переиспользуемые UI-компоненты
- `src/services/` — Redux-слайсы и действия
- `src/utils/` — типы, API-клиент, работа с cookies
- `tests/` — тесты Playwright и Jest

Важные файлы:

- `src/index.tsx` — точка входа, подключение `BrowserRouter` и `Provider`
- `src/components/app/app.tsx` — роутинг и композиция приложения
- `src/services/store.ts` — конфигурация Redux-стора
- `src/utils/burger-api.ts` — функции запросов к серверу
- `src/utils/types.ts` — типы данных
- `src/components/protected-route/protected-route.tsx` — защищённый маршрут

---

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

---

# Stellar Burgers

Приложение представляет собой SPA для конструирования и заказа бургеров. Пользователь выбирает булку, начинку и соус из каталога ингредиентов, формирует заказ и отслеживает его статус в ленте. Авторизованные пользователи получают доступ к личному кабинету с историей заказов.

## Архитектура приложения

Приложение построено на React с использованием Redux Toolkit для глобального состояния, React Router DOM для навигации и токеновой авторизации (JWT) для защиты персональных страниц.

---

### Базовый код

Точка входа — `src/index.tsx`, где создаётся корень React DOM, подключаются `Provider` для Redux и `BrowserRouter` для роутинга. Компонент `App` (`src/components/app/app.tsx`) определяет маршруты, подключает `AppHeader` и управляет модальными окнами.

**Поля/Сущности модуля:**

- `src/index.tsx` — инициализация ReactDOM, обёртка `<Provider store={store}>` и `<BrowserRouter>`.
- `src/components/app/app.tsx` — корневой компонент приложения, определяет маршруты, управляет модальными окнами через `location.state.background`, подписывается на состояние стора.

---

### Данные

Запрос данных к серверу осуществляется через функции в `src/utils/burger-api.ts`. Все API-вызовы используют обёртку `fetchWithRefresh`, которая автоматически обновляет `accessToken` при получении ошибки `jwt expired`. Токены хранятся в cookies (`accessToken`) и `localStorage` (`refreshToken`).

**API-функции:**

- `getIngredientsApi(): TIngredient[]` — возвращает список всех ингредиентов с сервера.
- `getFeedsApi(): TOrdersData` — возвращает ленту всех заказов (public).
- `getOrdersApi(): TOrder[]` — возвращает заказы авторизованного пользователя (требует авторизации).
- `orderBurgerApi(data: string[]): TNewOrderResponse` — создаёт новый заказ, принимает массив ID ингредиентов, возвращает объект с полем `order: TNewOrder`.
- `getOrderByNumberApi(number: number): TOrder` — возвращает заказ по его номеру.
- `registerUserApi(data: TRegisterData): TAuthResponse` — регистрирует нового пользователя.
- `loginUserApi(data: TLoginData): TAuthResponse` — авторизует пользователя.
- `forgotPasswordApi(data: { email: string }): void` — отправляет письмо для сброса пароля.
- `resetPasswordApi(data: { password: string; token: string }): void` — сбрасывает пароль по токену.
- `getUserApi(): TUser` — возвращает данные текущего авторизованного пользователя.
- `updateUserApi(user: Partial<TRegisterData>): TUser` — обновляет данные пользователя.
- `logoutApi(): void` — завершает сессию, удаляет токены.
- `refreshToken(): TRefreshResponse` — обновляет пару токенов по refresh-токену.
- `fetchWithRefresh<T>(url: RequestInfo, options: RequestInit): Promise<T>` — обёртка над fetch с автоматическим обновлением токена при истечении.

**Утилиты работы с cookies:**

- `getCookie(name: string): string | undefined` — читает cookie по имени.
- `setCookie(name: string, value: string, props?: object): void` — записывает cookie с опциями (path, expires).
- `deleteCookie(name: string): void` — удаляет cookie, устанавливая `expires: -1`.

---

### Модели данных

#### Тип `TIngredient`

Описывает один ингредиент из каталога.

**Поля:**

- `_id: string` (уникальный идентификатор)
- `name: string` (название)
- `type: string` (тип: `'bun' | 'main' | 'sauce'`)
- `proteins: number` (белки)
- `fat: number` (жиры)
- `carbohydrates: number` (углеводы)
- `calories: number` (калории)
- `price: number` (цена)
- `image: string` (URL изображения)
- `image_large: string` (URL изображения увеличенного размера)
- `image_mobile: string` (URL изображения для мобильных устройств)

#### Тип `TConstructorIngredient`

Ингредиент, добавленный в конструктор бургера. Наследует поля от `TIngredient` (наследует поля от TIngredient).

**Поля:**

- `id: string` (локальный UUID, используется для идентификации в конструкторе)

#### Тип `TOrder`

Описывает заказ.

**Поля:**

- `_id: string` (уникальный идентификатор заказа)
- `status: string` (статус заказа)
- `name: string` (название заказа)
- `createdAt: string` (дата создания)
- `updatedAt: string` (дата последнего обновления)
- `number: number` (номер заказа)
- `ingredients: string[]` (массив ID ингредиентов)

#### Тип `TOrdersData`

Результат запроса ленты заказов.

**Поля:**

- `orders: TOrder[]` (список заказов)
- `total: number` (общее количество заказов)
- `totalToday: number` (количество заказов за сегодня)

#### Тип `TUser`

Данные авторизованного пользователя.

**Поля:**

- `email: string` (адрес электронной почты)
- `name: string` (имя пользователя)

#### Тип `TRegisterData`

Данные для регистрации.

**Поля:**

- `email: string` (адрес электронной почты)
- `name: string` (имя пользователя)
- `password: string` (пароль)

#### Тип `TLoginData`

Данные для авторизации.

**Поля:**

- `email: string` (адрес электронной почты)
- `password: string` (пароль)

#### Тип `TCurrentOrder`

Текущая конструкция бургера в сторе.

**Поля:**

- `bun: null | TIngredient` (булка, изначально пустая)
- `ingredients: TConstructorIngredient[]` (список добавленных ингредиентов, изначально пустой массив)

---

### Redux-слайсы

#### Слайс `ingredientsSlice`

Хранит каталог ингредиентов и состояние загрузки.

**Поля:**

- `isLoading: boolean` (флаг загрузки, изначально false)
- `ingredients: TIngredient[]` (каталог, изначально пустой массив)
- `error: string | null` (ошибка, изначально null)

**Токены:**

- `getIngredientsThunk` — загружает ингредиенты через `getIngredientsApi`.

**Селекторы:**

- `selectIngredients` — возвращает список всех ингредиентов.
- `selectIsLoading` — возвращает флаг загрузки.
- `selectError` — возвращает ошибку.
- `selectBuns` — фильтрует булки (type === 'bun').
- `selectMains` — фильтрует начинки (type === 'main').
- `selectSauces` — фильтрует соусы (type === 'sauce').

#### Слайс `orderSlice`

Управляет состоянием конструктора, заказов и ленты.

**Поля:**

- `isOrderLoading: boolean` (флаг создания заказа, изначально false)
- `isOrderNumberLoading: boolean` (флаг запроса по номеру, изначально false)
- `isFeedLoading: boolean` (флаг загрузки ленты, изначально false)
- `isHistoryLoading: boolean` (флаг загрузки истории, изначально false)
- `current: TCurrentOrder` (текущая конструкция, изначально `{ bun: null, ingredients: [] }`)
- `orderData: TOrder | null` (данные последнего созданного заказа, изначально null)
- `orderByNumber: TOrder | null` (заказ по номеру, изначально null)
- `history: TOrdersData` (история заказов пользователя, изначально `{ orders: [], total: 0, totalToday: 0 }`)
- `feed: TOrdersData` (лента заказов, изначально `{ orders: [], total: 0, totalToday: 0 }`)

**Методы класса:**

- `addIngredientToOrder: (ingredient: TConstructorIngredient) => void` — добавляет ингредиент в текущую конструкцию; если это булка — заменяет существующую, иначе добавляет в список.
- `makeOrder: (order: TOrder) => void` — переносит созданный заказ в историю.
- `removeIngredient: (id: string) => void` — удаляет ингредиент из конструкции по локальному ID.
- `moveIngredient: (fromIndex: number, toIndex: number) => void` — меняет местами ингредиенты в конструкции.
- `resetOrderData: () => void` — сбрасывает данные о созданном заказе.

**Токены:**

- `orderBurgerThunk` — создаёт заказ через `orderBurgerApi`.
- `getOrderByNumberThunk` — получает заказ по номеру через `getOrderByNumberApi`.
- `getFeedsThunk` — загружает ленту через `getFeedsApi`.
- `getOrdersThunk` — загружает заказы пользователя через `getOrdersApi`.

#### Слайс `userSlice`

Управляет состоянием авторизации пользователя.

**Поля:**

- `isInit: boolean` (флаг инициализации авторизации, изначально false)
- `isCheckingSession: boolean` (флаг проверки сессии, изначально true)
- `isLoading: boolean` (флаг загрузки, изначально false)
- `user: TUser | null` (данные пользователя, изначально null)

**Методы класса:**

- `setUser: (user: TUser | null) => void` — устанавливает данные пользователя.
- `setIsInit: (value: boolean) => void` — устанавливает флаг инициализации авторизации.
- `setIsLoading: (value: boolean) => void` — устанавливает флаг загрузки.
- `setSessionCheckComplete: () => void` — отмечает завершение проверки сессии.

**Токены:**

- `loginUserThunk` — авторизует пользователя и сохраняет токены в cookie/localStorage.
- `registerUserThunk` — регистрирует пользователя и сохраняет токены.
- `getUserThunk` — получает данные текущего пользователя.
- `logoutThunk` — завершает сессию и удаляет токены.
- `updateUserThunk` — обновляет данные пользователя.

**Селекторы:**

- `selectUser` — возвращает данные пользователя.
- `selectIsAuthInit` — возвращает флаг инициализации авторизации.
- `selectIsLoading` — возвращает флаг загрузки.
- `selectIsCheckingSession` — возвращает флаг проверки сессии.

---

### Роутинг

Маршруты определены в `src/components/app/app.tsx`:

| Путь                      | Страница                       | Доступ                  |
| ------------------------- | ------------------------------ | ----------------------- |
| `/`                       | `ConstructorPage`              | все пользователи        |
| `/feed`                   | `Feed`                         | все пользователи        |
| `/feed/:number`           | `OrderInfo` (модально)         | все пользователи        |
| `/ingredients/:id`        | `IngredientDetails` (модально) | все пользователи        |
| `/login`                  | `Login`                        | только неавторизованные |
| `/register`               | `Register`                     | только неавторизованные |
| `/forgot-password`        | `ForgotPassword`               | только неавторизованные |
| `/reset-password`         | `ResetPassword`                | только неавторизованные |
| `/profile`                | `Profile`                      | только авторизованные   |
| `/profile/orders`         | `ProfileOrders`                | только авторизованные   |
| `/profile/orders/:number` | `OrderInfo` (модально)         | только авторизованные   |
| `*`                       | `NotFound404`                  | все пользователи        |

Защищённые маршруты (`/profile/*`) используют компонент `ProtectedRoute`, который перенаправляет на `/login` при отсутствии авторизации. Маршруты для неавторизованных (`/login`, `/register` и др.) используют `ProtectedRoute onlyUnAuth` и перенаправляют на главную при успешной авторизации.

Модальные окна открываются через `location.state.background` — при навигации основной маршрут скрывается, а в `<Routes location={background}>` рендерится обёртка `Modal`.

---

### Тестирование

Проект покрыт юнит-тестами (Jest) и E2E-тестами (Playwright).

**Jest:**

- `src/services/rootReducer.test.ts` — проверка корректной настройки `rootReducer`.
- `src/services/ingredients/slice.test.ts` — тесты слайса ингредиентов.
- `src/services/order/slice.test.ts` — тесты слайса заказов.
- `src/services/user/slice.test.ts` — тесты слайса пользователя.

**Playwright:**

- `tests/constructor.spec.tsx` — тесты конструктора бургера: добавление ингредиента, открытие/закрытие модального окна, создание заказа и очистка конструктора. HAR-файлы из `tests/hars/` используются для мок-ответов API.

**Команды:**

- `npm test` — запуск Jest-тестов
- `npm run playwright` — запуск Playwright-тестов
- `npm run playwright:ui` — запуск Playwright в UI-режиме
- `npm run playwright:report` — показ отчёта Playwright

---

### Запуск Storybook

```
npm run storybook
```

Сборка билда Storybook:

```
npm run build-storybook
```

---

## Переменные окружения

Для корректной работы запросов к серверу необходимо добавить переменную `BURGER_API_URL` в окружение. Сама ссылка находится в файле `.env.example`.
