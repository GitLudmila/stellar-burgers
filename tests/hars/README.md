# Инструкция по записи HAR-файла для тестов Playwright

## Что такое HAR-файл

HAR (HTTP Archive) — это файл, который записывает все сетевые запросы и ответы между браузером и сервером во время тестирования.

## Как записать HAR-файл

### Способ 1: Через Playwright Codegen (рекомендуется)

1. **Запусти сервер разработки:**

   ```bash
   npm run start
   ```

2. **Запиши HAR-файл:**

   ```bash
   npx playwright codegen --save-har=tests/hars/api.har http://localhost:4000
   ```

3. **В открывшемся браузере выполни действия:**

   - Нажми кнопку **"Record HAR"** (красная точка в панели Playwright)
   - Открой страницу конструктора (`/`)
   - Кликни на любой ингредиент (откроется модалка)
   - Добавь несколько ингредиентов в заказ
   - Нажми "Оформить заказ"
   - Останови запись и закрой браузер

4. **Проверь, что файл создан:**
   ```bash
   ls tests/hars/
   ```

### Способ 2: Через DevTools Chrome

1. Открой `http://localhost:4000` в Chrome
2. Нажми **F12** → вкладка **Network**
3. Нажми **Record HAR** (красная точка) → **Clear** (сбросить)
4. Выполни действия:
   - Кликни на ингредиент
   - Добавь ингредиенты в заказ
   - Оформите заказ
5. Нажми правой кнопкой на вкладке Network → **Save all as HAR with content**
6. Сохрани файл как `tests/hars/api.har`

## Структура HAR-файла

HAR-файл должен содержать ответы на следующие запросы:

- `GET /api/ingredients` — список ингредиентов
- `GET /api/auth/user` — данные пользователя
- `POST /api/orders` — создание заказа
- `GET /api/orders` — список заказов

## Использование в тестах

В `constructor.spec.tsx` HAR-файл используется через:

```typescript
await page.routeFromHAR('tests/hars/api.har', {
  update: false,
  updateContent: 'embed',
  updateMode: 'minimal'
});
```

## Обновление HAR-файла

Если API изменился, нужно переписать HAR:

```bash
npx playwright codegen --save-har=tests/hars/api.har --update-http-methods http://localhost:4000
```

## Примечания

- HAR-файл должен быть добавлен в `.gitignore`, если содержит чувствительные данные
- Для CI/CD можно использовать `update: true` для автоматического обновления HAR
