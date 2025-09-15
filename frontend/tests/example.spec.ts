import { test, expect } from '@playwright/test';

test('login', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.locator('input[name="email"]').fill('teste@gmail.com');
  await page.locator('input[name="password"]').fill('password');
  await page.getByRole('button', { name: 'ENTRAR' }).click();
  await page.waitForLoadState();
});

