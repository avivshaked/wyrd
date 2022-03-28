type PerformanceMock = {
  mark: Performance["mark"];
  measure: Performance["measure"];
  getEntriesByName: Performance["getEntriesByName"];
  clearMarks: Performance["clearMarks"];
  clearMeasures: Performance["clearMeasures"];
  now: Performance["now"];
};

export function createPerformanceMark({
  name,
  detail,
  duration,
  entryType,
  startTime,
  toJSON,
}: Partial<PerformanceMark>): PerformanceMark {
  const mark: PerformanceMark = {
    name: name || "mark-mock",
    detail: detail || {},
    duration: duration ?? 0,
    entryType: entryType || "mark",
    startTime: startTime ?? 0,
    toJSON: toJSON || (() => mark),
  };

  return mark;
}

export function createPerformanceMeasure({
  duration,
  entryType,
  startTime,
  detail,
  toJSON,
  name,
}: Partial<PerformanceMeasure>) {
  const measure: PerformanceMeasure = {
    name: name || "mark-measure",
    detail: detail || {},
    duration: duration ?? 0,
    entryType: entryType || "measure",
    startTime: startTime ?? 0,
    toJSON: toJSON || (() => measure),
  };

  return measure;
}

const performanceMeasureMock: PerformanceMeasure = {
  name: "mark-measure",
  detail: {},
  duration: 0,
  entryType: "measure",
  startTime: 0,
  toJSON: () => performanceMeasureMock,
};

export const performanceMock: PerformanceMock = {
  mark: (
    markName: string,
    markOptions?: PerformanceMarkOptions
  ): PerformanceMark =>
    createPerformanceMark({
      name: markName,
      detail: markOptions?.detail,
      startTime: markOptions?.startTime,
    }),
  measure: (
    measureName: string,
    startOrMeasureOptions?: string | PerformanceMeasureOptions,
    endMark?: string
  ): PerformanceMeasure => {
    if (endMark && startOrMeasureOptions) {
      // this option can't do anything with the names of the marks, so it will return default measure
      return createPerformanceMeasure({
        name: measureName,
      });
    } else if (startOrMeasureOptions) {
      const { duration, detail, start } =
        startOrMeasureOptions as PerformanceMeasureOptions;
      return createPerformanceMeasure({
        name: measureName,
        duration,
        startTime: (start as number) || 0,
        detail,
      });
    } else {
      return createPerformanceMeasure({
        name: measureName,
      });
    }
  },
  getEntriesByName: (name: string, type?: string): PerformanceEntryList => {
    console.log("inside mock");
    if (type === "mark") {
      return [createPerformanceMark({ name })];
    } else {
      return [createPerformanceMeasure({ name })];
    }
  },
  clearMarks: () => undefined,
  clearMeasures: () => undefined,
  now: () => 0,
};
