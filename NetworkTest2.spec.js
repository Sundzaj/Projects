const { test, expect} = require('@playwright/test');

test('Security test request intercept', async ({ page }) => {
    //login and reach orders page
    const email = "nodel26493@dekpal.com";
    const password = "Password123$";
    const url = "https://rahulshettyacademy.com/client";
    //const productName = 'ZARA COAT 3';
    //const products = page.locator(".card-body");
    await page.goto(url);
    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill(password);
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');
    await page.locator(".card-body b").first().waitFor();
    await page.locator("button[routerlink*='myorders']").click();
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
        route => route.continue({ url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=68b5aad3f669d6cb0aac03ea' }))
    await page.locator("button:has-text('View')").first().click();
    await expect(page.locator("p").last()).toHaveText("You are not authorize to view this order");

});