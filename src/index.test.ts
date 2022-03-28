import "./index";
import { MeasureManager } from "./MeasureManager";
import {
  createCustomMeasureManager,
  measureManager,
  Wyrd as localWyrd,
} from "./index";

// This is just easier than using a bunch of ts-ignore
declare namespace window {
  let Wyrd: MeasureManager;
  let _Wyrd: MeasureManager;
  let Something: MeasureManager;
}

test("an instance of MeasureManager should be created", () => {
  expect(measureManager).toBeDefined();
  expect(localWyrd).toBeDefined();
});
test("there should be an instance of MeasureManager on the global", () => {
  expect(window["Wyrd"]).toBeDefined();
});

test("if Wyrd is already on the global window, _Wyrd should be on it", () => {
  expect(window["Wyrd"]).toBeDefined();
  expect(window["_Wyrd"]).not.toBeDefined();
  new MeasureManager();
  expect(window["_Wyrd"]).toBeDefined();
});

test("a custom Wyrd can be created", () => {
  expect(window["Wyrd"]).toBeDefined();
  expect(window["Something"]).not.toBeDefined();
  const customWyrd = createCustomMeasureManager({ globalName: "Something" });
  expect(window["Something"]).toBeDefined();
});
