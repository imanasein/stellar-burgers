import { test, expect } from '@playwright/test';
import ingredientsMock from './fixtures/ingredients.json';
import userMock from './fixtures/user.json';
import orderMock from './fixtures/order.json';
import { BUN_NAME, MAIN_NAME, ORDER_NUMBER } from './mocks/constants';

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    // Мок запроса ингредиентов
    await page.route(
      'https://norma.education-services.ru/api/ingredients',
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(ingredientsMock)
        });
      }
    );

    // Мок пользователя
    await page.route(
      'https://norma.education-services.ru/api/auth/user',
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(userMock)
        });
      }
    );

    // Мок создания заказа
    await page.route(
      'https://norma.education-services.ru/api/orders',
      async (route) => {
        if (route.request().method() === 'POST') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(orderMock)
          });
        } else {
          await route.continue();
        }
      }
    );

    // Подставляем токен авторизации
    await page.context().addCookies([
      {
        name: 'accessToken',
        value: 'mockedAccessToken',
        domain: 'localhost',
        path: '/'
      }
    ]);

    // Открываем приложение
    await page.goto('/');

    // Дожидаемся загрузки страницы
    await page.waitForLoadState('networkidle');

    // Дожидаемся появления первой карточки ингредиента
    await page
    .locator('li', { hasText: BUN_NAME })
    .first()
    .waitFor({ state: 'visible' });
  });

  test('добавление булки и начинки в конструктор', async ({ page }) => {
    // Добавляем булку
    await page
    .locator('li', { hasText: BUN_NAME })
    .getByRole('button', { name: 'Добавить' })
    .click();

    // Добавляем начинку
    await page
    .locator('li', { hasText: MAIN_NAME })
    .getByRole('button', { name: 'Добавить' })
    .click();

    // Проверяем верхнюю булку
    await expect(page.getByText(`${BUN_NAME} (верх)`)).toBeVisible();

    // Проверяем нижнюю булку
    await expect(page.getByText(`${BUN_NAME} (низ)`)).toBeVisible();

    // Проверяем наличие начинки в конструкторе
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

    await expect(page.getByText('Детали ингредиента')).toBeVisible();

    await page.getByTestId('modal-close-button').click();

    await expect(page.getByText('Детали ингредиента')).not.toBeVisible();
  });

  test('закрытие модального окна по оверлею', async ({ page }) => {
    await page.locator('li', { hasText: BUN_NAME }).getByRole('link').click();

    await expect(page.getByText('Детали ингредиента')).toBeVisible();

    // Кликаем в свободную область оверлея вне модального окна
    await page.getByTestId('modal-overlay').click({ position: { x: 5, y: 5 } });

    await expect(page.getByText('Детали ингредиента')).not.toBeVisible();
  });

  test('создание заказа', async ({ page }) => {
    // Добавляем булку
    await page
    .locator('li', { hasText: BUN_NAME })
    .getByRole('button', { name: 'Добавить' })
    .click();

    // Добавляем начинку
    await page
    .locator('li', { hasText: MAIN_NAME })
    .getByRole('button', { name: 'Добавить' })
    .click();

    // Оформляем заказ
    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    // Проверяем номер заказа
    await expect(page.getByText(ORDER_NUMBER)).toBeVisible();

    await expect(page.getByText('идентификатор заказа')).toBeVisible();

    // После успешного заказа конструктор должен очиститься
    await expect(page.getByText('Выберите булки').first()).toBeVisible();

    await expect(page.getByText('Выберите начинку').first()).toBeVisible();

    // Закрываем модалку заказа
    await page.getByTestId('modal-close-button').click();

    await expect(page.getByText(ORDER_NUMBER)).not.toBeVisible();
  });
});
