import { Measure } from "./Measure";
import { createPerformanceMeasure, performanceMock } from "./PerformanceMock";
import Mock = jest.Mock;

jest.useFakeTimers();

beforeEach(() => {});

afterAll(() => {
  jest.restoreAllMocks();
});

test("Measure instance should be created", () => {
  const m = new Measure({ name: "test-measure" });
  expect(m).toBeDefined();
});

test("finish should set isFinished to true", () => {
  const m = new Measure({ name: "test-measure" });
  expect(m.isFinished).toBe(false);
  m.finish();
  expect(m.isFinished).toBe(true);
});

test("markStart() should call performance.mark with the name of the measure and a postfix Start", () => {
  jest.spyOn(performanceMock, "mark");
  const m = new Measure({ name: "test" });
  expect(performanceMock.mark).not.toHaveBeenCalled();
  m.markStart();
  expect(performanceMock.mark).toHaveBeenCalledWith("testStart", undefined);
});

test("isInactive prop should be false", () => {
  const m = new Measure({ name: "test" });
  expect(m.isInactive).toBe(false);
});

test("isInactive prop should ne true if options isInactive is true", () => {
  const m = new Measure({ name: "test", isInactive: true });
  expect(m.isInactive).toBe(true);
});

test("markStart() should not call performance.mark if isInactive is true", () => {
  jest.spyOn(performanceMock, "mark");
  const m = new Measure({ name: "test", isInactive: true });
  expect(performanceMock.mark).not.toHaveBeenCalled();
  m.markStart();
  expect(performanceMock.mark).not.toHaveBeenCalled();
});

test("markStart() should not call performance.mark if Measure is finished", () => {
  jest.spyOn(performanceMock, "mark");
  const m = new Measure({ name: "test" });
  expect(performanceMock.mark).not.toHaveBeenCalled();
  m.finish();
  m.markStart();
  expect(performanceMock.mark).not.toHaveBeenCalled();
});

test("markEnd() should call performance.mark with the name of the measure and a postfix End", () => {
  jest.spyOn(performanceMock, "mark");
  const m = new Measure({ name: "test" });
  expect(performanceMock.mark).not.toHaveBeenCalled();
  m.markEnd();
  expect(performanceMock.mark).toHaveBeenCalledWith("testEnd", undefined);
});

test("markEnd() should call performance.mark with options", () => {
  jest.spyOn(performanceMock, "mark");
  const m = new Measure({ name: "test" });
  expect(performanceMock.mark).not.toHaveBeenCalled();
  const someOptions = {};
  m.markEnd(someOptions);
  expect(performanceMock.mark).toHaveBeenCalledWith("testEnd", someOptions);
});

test("markEnd() should not call performance.mark if isInactive is true", () => {
  jest.spyOn(performanceMock, "mark");
  const m = new Measure({ name: "test", isInactive: true });
  expect(performanceMock.mark).not.toHaveBeenCalled();
  m.markEnd();
  expect(performanceMock.mark).not.toHaveBeenCalled();
});

test("markEnd() should not call performance.mark if Measure is finished", () => {
  jest.spyOn(performanceMock, "mark");
  const m = new Measure({ name: "test" });
  expect(performanceMock.mark).not.toHaveBeenCalled();
  m.finish();
  m.markEnd();
  expect(performanceMock.mark).not.toHaveBeenCalled();
});

test("4 samples that should be 2 time buckets", () => {
  jest.spyOn(performanceMock, "getEntriesByName");

  (performanceMock.getEntriesByName as Mock).mockReturnValue([
    createPerformanceMeasure({
      duration: 100,
      startTime: 100,
    }),
    createPerformanceMeasure({
      duration: 200,
      startTime: 500,
    }),
    createPerformanceMeasure({
      duration: 200,
      startTime: 1100,
    }),
    createPerformanceMeasure({
      duration: 300,
      startTime: 1500,
    }),
  ]);
  const m = new Measure({ name: "test", timeBucketSize: 1000 });
  jest.runOnlyPendingTimers();

  expect(m.results[0].count).toBe(2);
  expect(m.results[0].average).toBe(150);
  expect(m.results[1].count).toBe(2);
  expect(m.results[1].average).toBe(250);
  expect(m.results.length).toBe(2);
});

test("should resume last bucket when not finished", () => {
  jest.spyOn(performanceMock, "getEntriesByName");
  (performanceMock.getEntriesByName as Mock).mockReturnValue([
    createPerformanceMeasure({
      duration: 100,
      startTime: 100,
    }),
    createPerformanceMeasure({
      duration: 200,
      startTime: 500,
    }),
    createPerformanceMeasure({
      duration: 200,
      startTime: 1100,
    }),
  ]);
  const m = new Measure({ name: "test", timeBucketSize: 1000 });

  jest.runOnlyPendingTimers();

  expect(m.results[0].count).toBe(2);
  expect(m.results[0].average).toBe(150);
  expect(m.results[1].count).toBe(1);
  expect(m.results[1].average).toBe(200);
  expect(m.results.length).toBe(2);

  (performanceMock.getEntriesByName as Mock).mockReturnValue([
    createPerformanceMeasure({
      duration: 300,
      startTime: 1500,
    }),
    createPerformanceMeasure({
      duration: 200,
      startTime: 2100,
    }),
    createPerformanceMeasure({
      duration: 210,
      startTime: 2500,
    }),
  ]);

  jest.runOnlyPendingTimers();

  expect(m.results[1].average).toBe(250);
  expect(m.results[1].count).toBe(2);
  expect(m.results[2].count).toBe(2);
  expect(m.results[2].average).toBe(205);
  expect(m.results.length).toBe(3);
});
