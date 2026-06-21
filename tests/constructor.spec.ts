import { test, expect } from '@playwright/test';
// список констант для тестов
const BUN_NAME = 'Краторная булка N-200i';
const MAIN_NAME = 'Биокотлета из марсианской Магнолии';
const ORDER_NUMBER = '12345';

test.describe('Тестирование Конструктора бургера', () => {
  test.beforeEach(async ({ page }) => {
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

    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });
    await page.routeFromHAR('./tests/hars/auth-user.har', {
      url: '**/api/auth/user',
      update: false
    });
    await page.routeFromHAR('./tests/hars/orders.har', {
      url: '**/api/orders',
      update: false
    });

    await page.goto('/');
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

    // Проверки строго внутри конструктора
    await expect(
      page
        .locator('[data-testid="constructor-ingredients"]')
        .getByText(`${BUN_NAME} (верх)`)
    ).toBeVisible();
    await expect(
      page
        .locator('[data-testid="constructor-ingredients"]')
        .getByText(`${BUN_NAME} (низ)`)
    ).toBeVisible();

    await expect(
      page
        .locator('[data-testid="constructor-ingredients"]')
        .getByText(MAIN_NAME)
    ).toBeVisible();
  });

  test('открытие модального окна ингредиента', async ({ page }) => {
    await page.locator('li', { hasText: BUN_NAME }).getByRole('link').click();

    // Проверки внутри модального окна
    await expect(
      page.getByTestId('modal').getByText('Детали ингредиента')
    ).toBeVisible();
    await expect(page.getByTestId('modal').getByText(BUN_NAME)).toBeVisible();
  });

  test('закрытие модального окна по крестику', async ({ page }) => {
    await page.locator('li', { hasText: BUN_NAME }).getByRole('link').click();

    // Убедились, что модалка открылась
    await expect(
      page.getByTestId('modal').getByText('Детали ингредиента')
    ).toBeVisible();

    await page.getByTestId('modal-close-button').click();

    await expect(page.getByText('Детали ингредиента')).not.toBeVisible();
  });

  test('закрытие модального окна по оверлею', async ({ page }) => {
    await page.locator('li', { hasText: BUN_NAME }).getByRole('link').click();

    // Убедились, что модалка открылась
    await expect(
      page.getByTestId('modal').getByText('Детали ингредиента')
    ).toBeVisible();

    await page.getByTestId('modal-overlay').click({
      position: { x: 5, y: 5 }
    });

    await expect(page.getByText('Детали ингредиента')).not.toBeVisible();
  });

  test('создание заказа', async ({ page }) => {
    // Добавляем булку и начинку
    await page
      .locator('li', { hasText: BUN_NAME })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page
      .locator('li', { hasText: MAIN_NAME })
      .getByRole('button', { name: 'Добавить' })
      .click();

    // Оформляем заказ
    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    // Проверяем содержимое модального окна заказа
    await expect(
      page.getByTestId('modal').getByText(ORDER_NUMBER)
    ).toBeVisible();
    await expect(
      page.getByTestId('modal').getByText('идентификатор заказа')
    ).toBeVisible();

    // Проверяем, что конструктор очистился – появились плейсхолдеры
    // Два плейсхолдера "Выберите булки" (верх/низ) – уточняем .first() и .nth(1)
    await expect(
      page
        .locator('[data-testid="constructor-ingredients"]')
        .getByText('Выберите булки')
        .first()
    ).toBeVisible();
    await expect(
      page
        .locator('[data-testid="constructor-ingredients"]')
        .getByText('Выберите булки')
        .nth(1)
    ).toBeVisible();

    // Плейсхолдер для начинки
    await expect(
      page
        .locator('[data-testid="constructor-ingredients"]')
        .getByText('Выберите начинку')
    ).toBeVisible();

    // Закрываем модальное окно заказа
    await page.getByTestId('modal-close-button').click();

    // Убеждаемся, что номер заказа исчез
    await expect(page.getByText(ORDER_NUMBER)).not.toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
  });
});
