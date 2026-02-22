import { test, expect } from '@playwright/test';

test.describe('Order Flow', () => {
  test('should complete a full order flow in French', async ({ page }) => {
    // 1. Navigate to Home
    await page.goto('/fr');

    // 2. Click on the first product link
    const firstProductLink = page.getByTestId('ProductElement').first().locator('a');
    await expect(firstProductLink).toBeVisible();
    await firstProductLink.click();

    // 3. Verify Product Page and Click "Order Now"
    await expect(page).toHaveURL(/\/fr\/products\/.+/);

    // Wait for the button to be stable
    const orderNowButton = page.getByRole('button', { name: /Commander maintenant/i }).first();
    await expect(orderNowButton).toBeVisible();
    await orderNowButton.click();

    // 4. Fill the Order Form
    const modal = page.getByTestId('OrderFormModal');
    await expect(modal).toBeVisible({ timeout: 15000 });

    // Fill basic fields
    await modal.locator('input[name="name"]').fill('Test User');
    await modal.locator('input[name="address"]').fill('123 Test Street');
    // Generate random phone number to bypass API duplicate check
    const randomDigits = Math.floor(10000000 + Math.random() * 90000000).toString();
    const phoneNumber = `055${randomDigits.slice(0, 7)}`;
    await modal.locator('input[name="phone"]').fill(phoneNumber);

    // Fill Wilaya (Combobox)
    const wilayaInput = modal.getByTestId('WilayaInput');
    await wilayaInput.click();
    // Just click the first available option directly
    const firstWilaya = page.getByRole('option').first();
    await expect(firstWilaya).toBeVisible();
    await firstWilaya.click();

    // Fill Commune (Combobox)
    const communeInput = modal.getByTestId('CityInput');
    await expect(communeInput).toBeEnabled({ timeout: 10000 });
    await communeInput.click();
    // Just click the first available option directly
    const firstCommune = page.getByRole('option').first();
    await expect(firstCommune).toBeVisible();
    await firstCommune.click();

    // Select Delivery Option
    const deliverySelect = modal.locator('select[name="delivery_type"]');
    await expect(deliverySelect).toBeEnabled({ timeout: 10000 });
    await deliverySelect.selectOption({ index: 1 });

    // 5. Submit the Order
    const submitButton = modal.getByRole('button', { name: /Soumettre/i });
    await expect(submitButton).toBeVisible();
    await submitButton.click();

    // 6. Verify Thank You Page
    await expect(page).toHaveURL(/\/fr\/thank-you/, { timeout: 20000 });
    await expect(page.getByRole('heading', { level: 2 })).toContainText(/Merci/i);
    await expect(page.locator('p.font-mono')).not.toBeEmpty(); // Tracking number
  });
});
