import { Measure } from "./Measure";
import { createPerformanceMeasure, performanceMock } from "./PerformanceMock";
import Mock = jest.Mock;

beforeEach(() => {
  jest.spyOn(performanceMock, "mark");
  jest.spyOn(performanceMock, "measure");
  jest
    .spyOn(performanceMock, "getEntriesByName")
    .mockImplementation(performanceMock.getEntriesByName);
  jest.spyOn(performanceMock, "clearMarks");
  jest.spyOn(performanceMock, "clearMeasures");
  jest.spyOn(performanceMock, "now");
});

// afterEach(() => {
//   (performanceMock.mark as Mock).mockReset();
//   (performanceMock.measure as Mock).mockReset();
//   (performanceMock.getEntriesByName as Mock).mockReset();
//   (performanceMock.clearMarks as Mock).mockReset();
//   (performanceMock.clearMeasures as Mock).mockReset();
//   (performanceMock.now as Mock).mockReset();
// });

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
  const m = new Measure({ name: "test", isInactive: true });
  expect(performanceMock.mark).not.toHaveBeenCalled();
  m.markStart();
  expect(performanceMock.mark).not.toHaveBeenCalled();
});

test("markStart() should not call performance.mark if Measure is finished", () => {
  const m = new Measure({ name: "test" });
  expect(performanceMock.mark).not.toHaveBeenCalled();
  m.finish();
  m.markStart();
  expect(performanceMock.mark).not.toHaveBeenCalled();
});

test("markStart() should increase the markCount on the instance", () => {
  const m = new Measure({ name: "test" });
  // @ts-ignore
  const count = m._sampleCount;
  m.markStart();
  m.markEnd();
  // @ts-ignore
  expect(m._sampleCount).toBe(count + 1);
});

test("markEnd() should call performance.mark with the name of the measure and a postfix End", () => {
  const m = new Measure({ name: "test" });
  expect(performanceMock.mark).not.toHaveBeenCalled();
  m.markEnd();
  expect(performanceMock.mark).toHaveBeenCalledWith("testEnd", undefined);
});

test("markEnd() should call performance.mark with options", () => {
  const m = new Measure({ name: "test" });
  expect(performanceMock.mark).not.toHaveBeenCalled();
  const someOptions = {};
  m.markEnd(someOptions);
  expect(performanceMock.mark).toHaveBeenCalledWith("testEnd", someOptions);
});

test("markEnd() should not call performance.mark if isInactive is true", () => {
  const m = new Measure({ name: "test", isInactive: true });
  expect(performanceMock.mark).not.toHaveBeenCalled();
  m.markEnd();
  expect(performanceMock.mark).not.toHaveBeenCalled();
});

test("markEnd() should not call performance.mark if Measure is finished", () => {
  const m = new Measure({ name: "test" });
  expect(performanceMock.mark).not.toHaveBeenCalled();
  m.finish();
  m.markEnd();
  expect(performanceMock.mark).not.toHaveBeenCalled();
});

test("markEnd() should call performance.measure with the name of the measure", () => {
  const m = new Measure({ name: "test" });
  expect(performanceMock.measure).not.toHaveBeenCalled();
  m.markEnd();
  expect(performanceMock.measure).toHaveBeenCalledWith(
    "test",
    "testStart",
    "testEnd"
  );
});

test("markEnd() should call performance.measure with the name of the measure and options", () => {
  const m = new Measure({ name: "test" });
  expect(performanceMock.measure).not.toHaveBeenCalled();
  const someOptions = {};
  m.markEnd(undefined, someOptions);
  expect(performanceMock.measure).toHaveBeenCalledWith("test", someOptions);
});

test("4 samples that should be 2 time buckets", () => {
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
  (performanceMock.now as Mock).mockReturnValue(0);
  const m = new Measure({ name: "test", timeBucketSize: 1000, maxSamples: 4 });

  m.markStart();
  m.markEnd();
  m.markStart();
  m.markEnd();
  m.markStart();
  m.markEnd();
  m.markStart();
  m.markEnd();

  expect(m.results[0].count).toBe(2);
  expect(m.results[0].average).toBe(150);
  expect(m.results[1].count).toBe(2);
  expect(m.results[1].average).toBe(250);
  expect(m.results.length).toBe(2);
});

test("should resume last bucket when not finished", () => {
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
  (performanceMock.now as Mock).mockReturnValue(0);
  const m = new Measure({ name: "test", timeBucketSize: 1000, maxSamples: 3 });

  m.markStart();
  m.markEnd();
  m.markStart();
  m.markEnd();
  m.markStart();
  m.markEnd();

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

  m.markStart();
  m.markEnd();
  m.markStart();
  m.markEnd();
  m.markStart();
  m.markEnd();

  expect(m.results[1].average).toBe(250);
  expect(m.results[1].count).toBe(2);
  expect(m.results[2].count).toBe(2);
  expect(m.results[2].average).toBe(205);
  expect(m.results.length).toBe(3);
});
