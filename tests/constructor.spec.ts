import { test, expect } from '@playwright/test';
import { BUN_NAME, MAIN_NAME, ORDER_NUMBER } from './mocks/constants';

test.describe('Тестирование Конструктора бургера', () => {
  test.beforeEach(async ({ page }) => {
    // Очистка состояния и установка авторизации
    await page.context().clearCookies();
    await page.addInitScript(() => {
      localStorage.clear();
      localStorage.setItem('refreshToken', 'mockedRefreshToken');
    });
    await page.context().addCookies([
      {
        name: 'accessToken',
        value: 'mockedAccessToken',
        domain: 'localhost',
        path: '/'
      }
    ]);

    // Мок GET /api/auth/user – всегда успешный ответ (пользователь авторизован)
    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: { email: 'test@example.com', name: 'Тест' }
        })
      });
    });

    // HAR только для ингредиентов (GET /api/ingredients)
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });

    // Ручной мок для POST /api/orders
    await page.route('**/api/orders', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            name: 'test order',
            order: { number: ORDER_NUMBER }
          })
        });
      } else {
        await route.continue();
      }
    });

    // Открываем приложение
    await page.goto('/');

    // Ждём появления текста булки – стабильный признак загрузки списка ингредиентов
    await page.getByText(BUN_NAME).first().waitFor({ state: 'visible' });
  });

  test('добавление булки и начинки в конструктор', async ({ page }) => {
    await page
    .locator('li', { hasText: BUN_NAME })
    .getByRole('button', { name: 'Добавить' })
    .click();

    await page
    .locator('li', { hasText: MAIN_NAME })
    .getByRole('button', { name: 'Добавить' })
    .click();

    await expect(page.getByText(`${BUN_NAME} (верх)`)).toBeVisible();
    await expect(page.getByText(`${BUN_NAME} (низ)`)).toBeVisible();

    await expect(
      page
      .locator('[data-testid="constructor-ingredients"]')
      .getByText(MAIN_NAME)
    ).toBeVisible();
  });

  test('открытие модального окна ингредиента', async ({ page }) => {
    await page.locator('li', { hasText: BUN_NAME }).getByRole('link').click();

    await expect(page.getByText('Детали ингредиента')).toBeVisible();
    await expect(page.getByText(BUN_NAME).last()).toBeVisible();
  });

  test('закрытие модального окна по крестику', async ({ page }) => {
    await page.locator('li', { hasText: BUN_NAME }).getByRole('link').click();

    await page.getByTestId('modal-close-button').click();

    await expect(page.getByText('Детали ингредиента')).not.toBeVisible();
  });

  test('закрытие модального окна по оверлею', async ({ page }) => {
    await page.locator('li', { hasText: BUN_NAME }).getByRole('link').click();

    await page.getByTestId('modal-overlay').click({
      position: { x: 5, y: 5 }
    });

    await expect(page.getByText('Детали ингредиента')).not.toBeVisible();
  });

  test('создание заказа', async ({ page }) => {
    await page
    .locator('li', { hasText: BUN_NAME })
    .getByRole('button', { name: 'Добавить' })
    .click();

    await page
    .locator('li', { hasText: MAIN_NAME })
    .getByRole('button', { name: 'Добавить' })
    .click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByText(ORDER_NUMBER)).toBeVisible();
    await expect(page.getByText('идентификатор заказа')).toBeVisible();

    await expect(page.getByText('Выберите булки').first()).toBeVisible();
    await expect(page.getByText('Выберите начинку').first()).toBeVisible();

    await page.getByTestId('modal-close-button').click();

    await expect(page.getByText(ORDER_NUMBER)).not.toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
  });
});
