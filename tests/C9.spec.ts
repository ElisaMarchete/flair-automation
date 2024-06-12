/**
 * Feature: Search for a round trip flight with valid details
 */

import { expect, test } from "@playwright/test";
import { addDays, format } from "date-fns";

let today = new Date();
let day = format(today, "dd");
let from = format(addDays(new Date(), 1), "EEE MMM dd, yyy"); //Fri Jun 19, 2024
let to = format(addDays(new Date(), 7), "EEE MMM dd, yyy"); //Fri Jun 19, 2024

// npx playwright codegen https://flyflair.com/
test("Search for a round trip flight with valid details", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "english" }).click();
  await page.getByPlaceholder("from").click();
  await page.getByPlaceholder("from").fill("yyz");
  await page.getByText("torontoyyz").click();
  await page.getByPlaceholder("to").click();
  await page.getByPlaceholder("to").fill("yyc");
  await page.getByText("calgaryyyc").click();
  page.getByText("departure date", { exact: true });
  // let calendar = page.getByRole("gridcell");
  await page.getByLabel(from).click();
  // await getFrom.click();

  page.getByText("return date", { exact: true });
  await page.getByLabel(to).click();

  await page.getByRole("button", { name: "done" }).click();
  await page.getByRole("button", { name: "search flights" }).click();

  // await expect(page.getByTestId(from)).toBeVisible();
  await expect(page.getByText("choose departing flight")).toBeVisible();
  await expect(page.locator(`text=${from}`)).toBeVisible();

  await expect(page.getByText("choose return flight")).toBeVisible();
  await expect(page.locator(`text=${to}`)).toBeVisible();
});
