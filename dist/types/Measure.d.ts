import { MeasureOptions } from "./MeasureOptions";
import { TimeBucketResult } from "./TimeBucketResult";
export declare class Measure {
    private readonly _name;
    get name(): string;
    private readonly _markStartName;
    private readonly _markEndName;
    private readonly _timeBucketSize;
    private readonly _intervalInMilliseconds;
    private _interval;
    private readonly _maxBuckets;
    private _isActive;
    private readonly _isInactive;
    get isInactive(): boolean;
    private _isFinished;
    get isFinished(): boolean;
    private _startTime;
    private _results;
    get results(): TimeBucketResult[];
    /**
     *
     * @param {MeasureOptions} options
     */
    constructor(options: MeasureOptions);
    /**
     * Makes the Measure inactive. No future samples will be collected.
     */
    finish(): void;
    /**
     * Should be called just before the desired measurement
     */
    markStart(markOptions?: PerformanceMarkOptions): void;
    /**
     * Should be called to finish the measurement
     */
    markEnd(markOptions?: PerformanceMarkOptions, measureOptions?: PerformanceMeasureOptions): void;
    /**
     * returns a PerformanceMeasure list of the measurements specific to the container
     */
    getSamples(): PerformanceMeasure[];
    private _prepareResultBuckets;
    private _addMeasureToBucket;
    private static _calcBucketAverage;
    /**
     * returns a list of averages per time bucket
     * for example if the time bucket is 1000, i.e. one second, a list will be returned of 1 second averages
     */
    private _calcResultsForTimeBucket;
    private _resetMarksAndMeasures;
    private _sliceResultsArray;
    private _calcResultsAndReset;
    private _setupInterval;
}
//# sourceMappingURL=Measure.d.ts.map