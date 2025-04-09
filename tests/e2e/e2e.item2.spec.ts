import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { ProductsPage } from "../../pages/ProductsPage";
import { CartPage } from "../../pages/CartPage";
import { CheckoutPage } from "../../pages/CheckoutPage";
import { reusableLogin } from "../../utils/reusable-login";

test.describe("E2E - User can purchase 2 items", () => {
  test("2 items", async ({ page }) => {
    // Instantiate Page Objects
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Step 1: Login
    await reusableLogin(page);

    // Verify successful login
    await expect(page).toHaveURL(/inventory.html/);

    // Step 2: Add 2 item2 to cart
    await productsPage.addItemToCartByName("backpack");
    await productsPage.addItemToCartByName("bike-light");

    await productsPage.goToCart();

    // Verify item count is correct
    await expect(await cartPage.getCartItemCount()).toContainText("2");

    // Step 3: Proceed to checkout
    await cartPage.clickCheckout();

    // Step 4: Fill in checkout details
    await checkoutPage.fillCheckoutDetails("John", "Doe", "12345");

    // Step 5: Complete purchase
    await checkoutPage.finishCheckout();

    // Verify order confirmation message
    await expect(checkoutPage.getOrderConfirmation()).toHaveText(
      "Thank you for your order!"
    );

    console.log("✅ E2E Purchase 2 Items Test Passed!");
  });
});
