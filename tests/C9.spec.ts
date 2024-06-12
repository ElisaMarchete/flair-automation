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

  // close any adtional web page popup if any
  const [newpage] = await Promise.all([
    context.waitForEvent("page"),
    page.waitForEvent("popup"),
  ]);
  await page.close();
  await newpage.bringToFront();

  // Validate information of the seach results
  await newpage.waitForLoadState("load");
  await expect(newpage).toHaveURL("/booking/select");

  await expect(
    newpage.getByRole("heading", { name: "choose departing flight" })
  ).toBeVisible();
  // await expect(newpage.locator(`text=${from}`)).toBeVisible();
  expect(newpage.getByText("toronto (YYZ)calgary (YYC)"));

  await expect(
    newpage.getByRole("heading", { name: "choose return flight" })
  ).toBeVisible();
  // await expect(newpage.locator(`text=${to}`)).toBeVisible();
  expect(newpage.getByText("calgary (YYC)toronto (YYZ)"));
});
