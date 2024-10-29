// import test from "playwright/test";
// import {
//   checkAddAllItemsToCart,
//   getLocalStorageCart,
//   goToInventoryPage,
// } from "../utils/utils";

// export const getFullCartBeforeAll = async () => {
//   let fullCart: number[] | null = null;

//   test.beforeAll(async ({ browser }) => {
//     //Get localStorage full cart value dynamically
//     const context = await browser.newContext();
//     const page = await context.newPage();
//     await goToInventoryPage(page);
//     await checkAddAllItemsToCart(page);
//     fullCart = await getLocalStorageCart(page);
//   });

//   return fullCart;
// };
