import { test, expect, Page } from '@playwright/test';
import ingredientsFixture from './fixtures/ingredients.json';
import userFixture from './fixtures/user.json';
import orderFixture from './fixtures/order.json';

const setupMockData = async (page: Page) => {
  await page.route('**/ingredients', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(ingredientsFixture)
    })
  );

  await page.route('**/auth/user', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(userFixture)
    })
  );

  await page.route('**/orders', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(orderFixture)
    })
  );

  await page.context().addCookies([
    {
      name: 'accessToken',
      value: 'test-access-token',
      domain: 'localhost',
      path: '/'
    }
  ]);

  await page.evaluate(() => {
    localStorage.setItem('refreshToken', 'test-refresh-token');
  });
};

test.describe('Тестируем модальное окно', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockData(page);
    await page.goto('/');
  });

  test.afterEach(async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.context().clearCookies();
  });

  test('При клике на ингредиент открывается и закрывается модалка', async ({
    page
  }) => {
    const ingredient = page.getByTestId('ingredient').first();
    await ingredient.click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('Ингредиент-1');

    const closeBtn = page.getByTestId('modal-close-btn');
    await closeBtn.click();

    await expect(modal).not.toBeVisible();
  });

  test('Закрываем модальное окно при клике на оверлей', async ({ page }) => {
    const ingredient = page.getByTestId('ingredient').first();
    await ingredient.click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();

    const overlay = page.getByTestId('modal-overlay');
    await overlay.click({ force: true });

    await expect(modal).not.toBeVisible();
  });

  test('В модальном окне отображаются данные конкретного ингредиента', async ({
    page
  }) => {
    // Открываем первый ингредиент
    const firstIngredient = page.getByTestId('ingredient').first();
    await firstIngredient.click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('Ингредиент-1');
    await expect(modal).toContainText('500');
    await expect(modal).toContainText('Калории, ккал');
    await expect(modal).toContainText('200');

    // Закрываем модалку через кнопку
    const closeBtn = page.getByTestId('modal-close-btn');
    await closeBtn.click();
    await expect(modal).not.toBeVisible();

    // Открываем второй ингредиент
    const secondIngredient = page.getByTestId('ingredient').nth(1);
    await secondIngredient.click();

    await expect(modal).toBeVisible();
    await expect(modal).toContainText('Ингредиент-2');
    await expect(modal).toContainText('300');
    await expect(modal).toContainText('150');

    // Закрываем через оверлей
    const overlay = page.getByTestId('modal-overlay');
    await overlay.click({ force: true });
    await expect(modal).not.toBeVisible();
  });

  test('Добавление ингредиентов с последующим оформлением заказа', async ({
    page
  }) => {
    // Добавляем ингредиенты в заказ
    const addIngredientBtns = page.getByTestId('add-inredient-btn');
    await addIngredientBtns.first().click();
    await addIngredientBtns.nth(1).click();

    // Проверяем что элементы добавились в заказ
    await expect(page.getByTestId('bun-ingredient')).toContainText(
      'Ингредиент-1'
    );
    await expect(page.getByTestId('others-ingredients')).toContainText(
      'Ингредиент-2'
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
      'Ингредиент-2'
    );
  });
});
