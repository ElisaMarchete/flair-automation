/**
 * Feature: Search for a round trip flight with valid details
 */

import { test } from "@playwright/test";
import { addDays, format } from "date-fns";

let today = new Date();
let day = format(today, "dd");
let from = format(addDays(new Date(), 1), "dd");
let to = format(addDays(new Date(), 7), "dd");
console.log(today);
console.log(day);
console.log(from);
console.log(to);

// npx playwright codegen https://flyflair.com/
test("Search for a round trip flight with valid details", async ({page}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "english" }).click();
  await page.getByPlaceholder("from").click();
  await page.getByPlaceholder("from").fill("yyz");
  await page.getByText("torontoyyz").click();
  await page.getByPlaceholder("to").click();
  await page.getByPlaceholder("to").fill("yyc");
  await page.getByText("calgaryyyc").click();
  await page.getByPlaceholder("depart").click();
  await page.getByText(from).click();
  await page.getByText(to).click();
});
