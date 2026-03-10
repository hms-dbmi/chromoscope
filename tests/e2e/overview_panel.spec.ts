import { test, expect } from '@playwright/test';
import { BASE_URL } from '../constants';

// Test overview panel
test('overview panel is immediately visible', async ({ page }) => {
    await page.goto(BASE_URL);

    // Check visibility
    const overviewPanel = page.locator('.vis-overview-panel');
    await expect(overviewPanel).toBeVisible();

    // Default cohort is PCAWG
    const cohortSelector = page.locator('.cohort-selector .dropdown-button span');
    await expect(cohortSelector).toHaveText('PCAWG: Cancer Cohort');

    // Default to first sample as selected
    const overviewItems = page.locator('.overview-container .overview');
    const firstOverviewItem = overviewItems.first();
    await expect(firstOverviewItem).toContainClass('selected-overview');

});