import { test, expect } from '@playwright/test';

test('page loads', async ({ page }) => {
  await page.goto('http://localhost:3000/app/');

  const navigationBar = page.locator('.vis-overview-panel .navigation-container');
  await expect(navigationBar).toBeVisible();
  
  const navigationBarTitle = navigationBar.locator('.links-left .sample-information .chromoscope-title');
  await expect(navigationBarTitle).toBeVisible();
  await expect(navigationBarTitle).toHaveText('CHROMOSCOPE');
});

test('clicking on the close button closes the overview panel', async ({ page }) => {
  await page.goto('http://localhost:3000/app/');

  const closeButton = page.locator('.vis-overview-panel .navigation-container .links-left .config-button');
  await closeButton.click();

  const navigationBar = page.locator('.navigation-container.viewer');
  await expect(navigationBar).toBeVisible();

  const sampleInformation = navigationBar.locator('.links-left .sample-information');

  const cancerType = sampleInformation.locator('.cancer-type');
  await expect(cancerType).toContainText('Breast')

  const demoId = sampleInformation.locator('.demo-id');
  await expect(demoId).toContainText('SRR7890905')
});

// Test for minmal mode integration with cBioPortal
// test('cBioPortal Integration is working properly', async ({page}) => {
//   await page.goto('https://www.cbioportal.org/patient/openResource_CHROMOSCOPE?studyId=pancan_pcawg_2020&caseId=DO2706');

//   const sampleTitle = page.locator('.patientViewPage .patientSample a[href^="https://www.cbioportal.org/"]').innerText();
  
//   const chromoscopeIframe = page.frameLocator('.patientViewPage iframe[src^="https://chromoscope.bio/app/"]');


// })