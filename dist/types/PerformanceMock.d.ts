declare type PerformanceMock = {
    mark: Performance["mark"];
    measure: Performance["measure"];
    getEntriesByName: Performance["getEntriesByName"];
    clearMarks: Performance["clearMarks"];
    clearMeasures: Performance["clearMeasures"];
    now: Performance["now"];
};
export declare function createPerformanceMark({ name, detail, duration, entryType, startTime, toJSON, }: Partial<PerformanceMark>): PerformanceMark;
export declare function createPerformanceMeasure({ duration, entryType, startTime, detail, toJSON, name, }: Partial<PerformanceMeasure>): PerformanceMeasure;
export declare const performanceMock: PerformanceMock;
export {};
//# sourceMappingURL=PerformanceMock.d.ts.map