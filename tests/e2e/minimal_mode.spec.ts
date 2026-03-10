import { test, expect } from '@playwright/test';
import { MINIMAL_MODE_URL } from '../constants';

// Minimal mode works properly
test('minimal mode', async ({ page }) => {
    // Load minimal mode page for test demos
    await page.goto(MINIMAL_MODE_URL);

    // Ensure overview panel is not visible
    const overviewPanel = page.locator('.vis-overview-panel');
    await expect(overviewPanel).toBeHidden();


    // Navigation Buttons tests
    const navigationButtons = page.locator('.minimal_mode .navigation-buttons .navigation-button-container');

    // Check that there are 2 buttons
    const navigationButtonsCount = await navigationButtons.count();
    await expect(navigationButtonsCount).toBe(2);

    const genomeViewButtonContainer = navigationButtons.first();
    await expect(genomeViewButtonContainer).toContainClass('navigation-button-genome');
    const genomeViewButton = genomeViewButtonContainer.locator('.navigation-button');
    await expect(genomeViewButton).toContainText('Genome View');
    
    const variantViewButtonContainer = navigationButtons.last();
    await expect(genomeViewButtonContainer).toContainClass('navigation-button-variant');
    const variantViewButton = variantViewButtonContainer.locator('.navigation-button');
    await expect(variantViewButton).toContainText('Variant View');
    

});