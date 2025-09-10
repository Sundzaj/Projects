const {test, expect, request} = require('@playwright/test');
const {ApiUtils} = require('./utils/ApiUtils');
const loginPayLoad = {userEmail: "nodel26493@dekpal.com", userPassword: "Password123$"};
const orderPayLoad = {orders: [{country: "India", productOrderedId: "68a961459320a140fe1ca57a"}]};
let token;
let orderId;
let response;

test.beforeAll(async()=>
{
const apiContext = await request.newContext();
const apiUtils = new ApiUtils(apiContext,loginPayLoad);
response = await apiUtils.createOrder(orderPayLoad);
})




test('Client App login', async ({page})=>
{   
    
    await page.addInitScript(value => {
        window.localStorage.setItem('token',value);
    }, response.token);
    await page.goto("https://rahulshettyacademy.com/client/")
    await page.locator("button[routerlink*='myorders']").click();
    await page.locator("tbody").waitFor();
    const rows = await page.locator("tbody tr");
    for(let i=0; i<await rows.count(); ++i)
    {
        const rowOrderId = await rows.nth(i).locator("th").textContent();
        if (response.orderId.includes(rowOrderId))
        {
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }
    const orderIdDetails = await page.locator(".col-text").textContent();
    expect(response.orderId.includes(orderIdDetails)).toBeTruthy();
    //await page.pause();
});