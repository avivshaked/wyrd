import { MeasureManager } from "./MeasureManager";
import { globalObj } from "./globalObj";
import { Measure } from "./Measure";
import spyOn = jest.spyOn;
import { MeasureOptions } from "./MeasureOptions";

test("globalName should return this name of the object on the global object", () => {
  const manager = new MeasureManager({ globalName: "wyrdTest" });
  expect(manager.globalName).toBe("wyrdTest");
  // @ts-ignore
  expect(globalObj["wyrdTest"]).toBeDefined();
});

test("if globalName in options is an empty string, the globalName will default to Wyrd", () => {
  const manager = new MeasureManager({ globalName: "" });
  console.log(manager);
  expect(manager.globalName).toBe("Wyrd");
  // @ts-ignore
  expect(globalObj["Wyrd"]).toBeDefined();
});

test("isOnGlobal should disclose if it's on the global", () => {
  const manager = new MeasureManager();
  expect(manager.isOnGlobal()).toBe(true);
});

test("removeFromGlobal should disclose if it's on the global", () => {
  const manager = new MeasureManager();
  expect(manager.isOnGlobal()).toBe(true);
  manager.removeFromGlobal();
  expect(manager.isOnGlobal()).toBe(false);
});

test("registerMeasure should add a new Measure to the manager if the name is unique", () => {
  const manager = new MeasureManager();
  expect(manager.getMeasures().length).toBe(0);
  const result = manager.registerMeasure("someFunctionNameToMeasure");
  expect(result).toBe(true);
  expect(manager.getMeasures().length).toBe(1);
});

test("it is possible to register many measures", () => {
  const manager = new MeasureManager();
  expect(manager.getMeasures().length).toBe(0);
  manager.registerMeasure("test1");
  manager.registerMeasure("test2");
  manager.registerMeasure("test3");
  manager.registerMeasure("test4");
  expect(manager.getMeasures().length).toBe(4);
});

test("registerMeasure should return false if name already exists", () => {
  const manager = new MeasureManager();
  expect(manager.getMeasures().length).toBe(0);
  const result = manager.registerMeasure("someFunctionNameToMeasure");
  expect(result).toBe(true);
  expect(manager.getMeasures().length).toBe(1);
  const result2 = manager.registerMeasure("someFunctionNameToMeasure");
  expect(result2).toBe(false);
  expect(manager.getMeasures().length).toBe(1);
});

test("registerMeasure should allow passing MeasureOptions", () => {
  const measureOptions: MeasureOptions = {
    name: "testOptions",
  };
  const manager = new MeasureManager();
  manager.registerMeasure(measureOptions);
  const measure = manager.getMeasure("testOptions");
  expect(measure?.name).toBe("testOptions");
});

test("removeMeasure should remove a measure if measure is found", () => {
  const manager = new MeasureManager();
  expect(manager.getMeasures().length).toBe(0);
  manager.registerMeasure("someFunctionNameToMeasure");
  expect(manager.getMeasures().length).toBe(1);
  const result = manager.removeMeasure("someFunctionNameToMeasure");
  expect(manager.getMeasures().length).toBe(0);
  expect(result).toBe(true);
});

test("removeMeasure should return false if measure is not found", () => {
  const manager = new MeasureManager();
  expect(manager.getMeasures().length).toBe(0);
  manager.registerMeasure("someFunctionNameToMeasure");
  expect(manager.getMeasures().length).toBe(1);
  const result = manager.removeMeasure("someOtherName");
  expect(manager.getMeasures().length).toBe(1);
  expect(result).toBe(false);
});

test("finishMeasure should call finish on the Measure if found", () => {
  const manager = new MeasureManager();
  manager.registerMeasure("measureName");
  const measure = manager.getMeasure("measureName") as Measure;
  expect(measure.isFinished).toBe(false);
  manager.finishMeasure("measureName");
  expect(measure.isFinished).toBe(true);
});

test("finishMeasure should return false if measure is not found", () => {
  const manager = new MeasureManager();
  manager.registerMeasure("someFunctionNameToMeasure");
  const result = manager.finishMeasure("someOtherName");
  expect(result).toBe(false);
});

test("markMeasureStart should call markStart on the Measure if found", () => {
  const manager = new MeasureManager();
  manager.registerMeasure("measureName");
  const measure = manager.getMeasure("measureName") as Measure;
  const markStartSpy = spyOn(measure, "markStart");
  manager.markMeasureStart("measureName");
  expect(markStartSpy).toHaveBeenCalledWith(undefined);
});

test("markMeasureStart should call markStart with the provided options", () => {
  const someOptions = {};
  const manager = new MeasureManager();
  manager.registerMeasure("measureName");
  const measure = manager.getMeasure("measureName") as Measure;
  const markStartSpy = spyOn(measure, "markStart");
  manager.markMeasureStart("measureName", someOptions);
  expect(markStartSpy).toHaveBeenCalledWith(someOptions);
});

test("markMeasureStart should return false if measure is not found", () => {
  const manager = new MeasureManager();
  manager.registerMeasure("someFunctionNameToMeasure");
  const result = manager.markMeasureStart("someOtherName");
  expect(result).toBe(false);
});

test("markMeasureEnd should call markEnd on the Measure if found", () => {
  const manager = new MeasureManager();
  manager.registerMeasure("measureName");
  const measure = manager.getMeasure("measureName") as Measure;
  const markEndSpy = spyOn(measure, "markEnd");
  manager.markMeasureEnd("measureName");
  expect(markEndSpy).toHaveBeenCalledWith(undefined, undefined);
});

test("markMeasureEnd should call markEnd with the provided options", () => {
  const someOptions = {};
  const someOtherOptions = {};
  const manager = new MeasureManager();
  manager.registerMeasure("measureName");
  const measure = manager.getMeasure("measureName") as Measure;
  const markEndSpy = spyOn(measure, "markEnd");
  manager.markMeasureEnd("measureName", someOptions, someOtherOptions);
  expect(markEndSpy).toHaveBeenCalledWith(someOptions, someOtherOptions);
});

test("markMeasureEnd should return false if measure is not found", () => {
  const manager = new MeasureManager();
  manager.registerMeasure("someFunctionNameToMeasure");
  const result = manager.markMeasureEnd("someOtherName");
  expect(result).toBe(false);
});

test("getSamples should return all the samples of a specific Measure", () => {
  const ret: any[] = [];
  const manager = new MeasureManager();
  manager.registerMeasure("measureName");
  const measure = manager.getMeasure("measureName") as Measure;
  const getSamplesMock = jest.spyOn(measure, "getSamples");
  getSamplesMock.mockReturnValue(ret);
  expect(manager.getSamples("measureName")).toBe(ret);
});

test("getSamples should return null if measure is not found", () => {
  const ret: any[] = [];
  const manager = new MeasureManager();
  manager.registerMeasure("measureName");
  expect(manager.getSamples("someOtherName")).toBe(null);
});

test("getResults should return the measure results if found", () => {
  const possibleResults: any[] = [];
  const manager = new MeasureManager();
  manager.registerMeasure("measureName");
  const measure = manager.getMeasure("measureName") as Measure;
  const getResultsMock = jest.spyOn(measure, "results", "get");
  getResultsMock.mockReturnValue(possibleResults);
  expect(manager.getResults("measureName")).toBe(possibleResults);
});

test("getResults should return null if the measure is not found", () => {
  const manager = new MeasureManager();
  manager.registerMeasure("measureName");
  expect(manager.getResults("otherMeasureName")).toBe(null);
});

test("getMeasuresMao should return the measures map", () => {
  const manager = new MeasureManager();
  manager.registerMeasure("someName");
  manager.registerMeasure("someOtherName");
  const measures = manager.getMeasuresMap();
  expect(measures.has("someName")).toBe(true);
  expect(measures.has("someOtherName")).toBe(true);
});

test("getMEasures should return the measures map", () => {
  const manager = new MeasureManager();
  manager.registerMeasure("someName");
  manager.registerMeasure("someOtherName");
  const measures = manager.getMeasures();
  expect(measures[0].name).toBe("someName");
  expect(measures[1].name).toBe("someOtherName");
});
