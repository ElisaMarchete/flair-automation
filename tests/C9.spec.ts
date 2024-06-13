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
test("Search for a round trip flight with valid details", async ({
  context,
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "english" }).click();
  // from Toronto YYZ
  await page.getByPlaceholder("from").click();
  await page.getByPlaceholder("from").fill("yyz");
  await page.getByText("torontoyyz").click();
  // to Calgary YYC
  await page.getByPlaceholder("to").click();
  await page.getByPlaceholder("to").fill("yyc");
  await page.getByText("calgaryyyc").click();
  // select departure date
  page.getByText("departure date", { exact: true });
  await page.getByLabel(from).click();
  // select return date
  page.getByText("return date", { exact: true });
  await page.getByLabel(to).click();
  await page.getByRole("button", { name: "done" }).click();
  await page.getByRole("button", { name: "search flights" }).click();

  // Wait for the new page and keep navigating on the main flair page
  const flairPagePromise = page.waitForEvent("popup");
  const flairPage = await flairPagePromise;

  // Validate result from search
  await flairPage.waitForLoadState("load");
  // Confirm the URL is correct
  await expect(flairPage).toHaveURL("/booking/select");

  // Validate departing flight details
  await expect(
    flairPage.getByRole("heading", { name: "choose departing flight" })
  ).toBeVisible();

  await expect(flairPage.getByText("toronto (YYZ)calgary (YYC)")).toBeVisible();

  let formatFrom = new Date(from).toLocaleDateString("en-US"); // "6/19/2024"
  let validateFrom = `date-${formatFrom}`;
  await expect(flairPage.getByTestId(validateFrom)).toBeVisible();

  // Validate return flight details
  await expect(
    flairPage.getByRole("heading", { name: "choose return flight" })
  ).toBeVisible();

  await expect(flairPage.getByText("calgary (YYC)toronto (YYZ)")).toBeVisible();

  let formatTo = new Date(to).toLocaleDateString("en-US");
  let validateTo = `date-${formatTo}`;
  await expect(flairPage.getByTestId(validateTo)).toBeVisible();
});
