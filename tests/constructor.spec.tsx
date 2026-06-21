import { test, expect } from '@playwright/test';
import fs from 'fs';

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    // Перехватываем все запросы к API и возвращаем ответы из HAR
    await page.route('**/api/**', async (route) => {
      const harPath = 'tests/hars/constructor.har';
      const har = JSON.parse(fs.readFileSync(harPath, 'utf-8'));

      const harEntries = har.log.entries;
      const entry = harEntries.find(
        (e: (typeof harEntries)[number]) =>
          e.request.url === route.request().url() &&
          e.request.method === route.request().method()
      );

      if (entry) {
        await route.fulfill({
          status: entry.response.status,
          contentType: 'application/json',
          body: entry.response.content.text
        });
      } else {
        await route.abort('file_not_found');
      }
    });
  });

  test('Добавление ингредиента в конструктор', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('ingredient').first()).toBeVisible();

    const bun = page
      .getByTestId('ingredient')
      .filter({ hasText: 'Краторная булка N-200i' })
      .first();
    await bun.locator('button').filter({ hasText: 'Добавить' }).click();

    await expect(page.getByTestId('constructor-bun-top')).toBeVisible();
    await expect(page.getByTestId('constructor-bun-top')).toContainText(
      'Краторная булка N-200i'
    );
  });

  test('Открытие и закрытие модального окна ингредиента по клику на ингредиент через кнопку', async ({
    page
  }) => {
    await page.goto('/');
    await expect(page.getByTestId('ingredient').first()).toBeVisible();

    const ingredient = page
      .getByTestId('ingredient')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
      .first();

    await ingredient.click();
    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('Биокотлета из марсианской Магнолии');

    await page.getByTestId('modal-close-btn').click();
    await expect(modal).not.toBeVisible();
  });

  test('Создание заказа и очистка конструктора', async ({ page, context }) => {
    await context.addInitScript(() => {
      localStorage.setItem('refreshToken', 'mock-refresh-token');
    });

    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer mock-access-token',
        url: 'http://localhost:4000'
      }
    ]);

    await page.goto('/');
    await expect(page.getByTestId('ingredient').first()).toBeVisible();

    const bun = page
      .getByTestId('ingredient')
      .filter({ hasText: 'Краторная булка N-200i' })
      .first();
    await bun.locator('button').filter({ hasText: 'Добавить' }).click();

    const main = page
      .getByTestId('ingredient')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
      .first();
    await main.locator('button').filter({ hasText: 'Добавить' }).click();

    await page.getByTestId('create-order-btn').click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('99999');

    await page.getByTestId('modal-close-btn').click();
    await expect(modal).not.toBeVisible();

    await expect(page.getByTestId('constructor-bun-top')).not.toBeVisible();
    await expect(page.getByTestId('constructor-bun-bottom')).not.toBeVisible();

    await context.clearCookies();
    await page.evaluate(() => localStorage.clear());
  });
});
