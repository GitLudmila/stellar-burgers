import { test, expect, Page } from '@playwright/test';

const setupMockData = async (page: Page) => {
  await page.routeFromHAR('tests/hars/api.har', {
    update: false,
    updateContent: 'embed',
    updateMode: 'minimal'
  });

  // Добавляем токены авторизации в cookie
  await page.context().addCookies([
    {
      name: 'accessToken',
      value: 'test-access-token',
      url: 'http://localhost:4000'
    },
    {
      name: 'refreshToken',
      value: 'test-refresh-token',
      url: 'http://localhost:4000'
    }
  ]);
};

test.describe('Тестируем модальное окно', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockData(page);
    await page.goto('/');

    // Устанавливаем localStorage ПОСЛЕ загрузки страницы
    await page.evaluate(() => {
      localStorage.setItem('accessToken', 'test-access-token');
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('Открытие и закрытие модального окна по клику на ингредиент через кнопку', async ({
    page
  }) => {
    const ingredient = page.getByTestId('ingredient').first();
    await ingredient.click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('Краторная булка N-200i');

    const closeBtn = page.getByTestId('modal-close-btn');
    await closeBtn.click({ force: true });

    await expect(modal).not.toBeVisible();
  });

  test('Закрываем модальное окно при клике на оверлей', async ({ page }) => {
    const ingredient = page.getByTestId('ingredient').first();
    await ingredient.click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();

    const overlay = page.getByTestId('modal-overlay');
    await overlay.click();

    await expect(modal).toBeHidden();
  });

  test('В модальном окне отображаются данные конкретного ингредиента', async ({
    page
  }) => {
    // Открываем первый ингредиент
    const firstIngredient = page.getByTestId('ingredient').first();
    await firstIngredient.click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('Краторная булка N-200i');

    // Закрываем модалку через кнопку
    const closeBtn = page.getByTestId('modal-close-btn');
    await closeBtn.click({ force: true });
    await expect(modal).not.toBeVisible();

    // Открываем второй ингредиент
    const secondIngredient = page.getByTestId('ingredient').nth(1);
    await secondIngredient.click();

    await expect(modal).toBeVisible();
    await expect(modal).toContainText('Биокотлета из марсианской Магнолии');

    // Закрываем через оверлей
    const overlay = page.getByTestId('modal-overlay');
    await overlay.click({ force: true });
    await expect(modal).not.toBeVisible();
  });

  test('Добавление ингредиентов с последующим оформлением заказа', async ({
    page
  }) => {
    // Добавляем ингредиенты в заказ
    const addIngredientBtns = page.getByTestId('add-ingredient-btn');
    await addIngredientBtns.first().click();
    await addIngredientBtns.nth(1).click();

    // Проверяем что элементы добавились в заказ
    await expect(page.getByTestId('bun-ingredient')).toContainText(
      'Краторная булка N-200i'
    );
    await expect(page.getByTestId('others-ingredients')).toContainText(
      'Биокотлета из марсианской Магнолии'
    );

    // Оформляем заказ
    const createOrderBtn = page.getByTestId('create-order-btn');
    await createOrderBtn.click();

    // Проверяем что модальное окно открыто
    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(page.getByTestId('order-number')).toContainText('1');

    // Закрываем модальное окно
    const overlay = page.getByTestId('modal-overlay');
    await overlay.click({ force: true });
    await expect(modal).not.toBeVisible();

    // Проверяем, что конструктор пуст
    await expect(page.getByTestId('bun-ingredient')).not.toBeVisible();
    await expect(page.getByTestId('others-ingredients')).not.toContainText(
      'Биокотлета из марсианской Магнолии'
    );
  });
});
