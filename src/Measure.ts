import { MeasureOptions } from "./MeasureOptions";
import { measureOptionsDefault } from "./measureOptionsDefault";
import { performanceMock } from "./PerformanceMock";
import { TimeBucketResult } from "./TimeBucketResult";

/**
 * Checking that window.performance has mark. Some test environment do not have it
 * In that case, a mock will be used instead of the actual performance object.
 */
const perf: typeof window["performance"] | typeof performanceMock =
  // @ts-ignore
  window?.performance?.mark ? window.performance : performanceMock;

export class Measure {
  private readonly _name: string;
  private readonly _markStartName: string;
  private readonly _markEndName: string;
  private readonly _timeBucketSize: number;
  private readonly _intervalInMilliseconds: number;
  private _interval: number | null = null;
  private readonly _maxBuckets: number;
  private _isActive: boolean;

  private readonly _isInactive: boolean;
  get isInactive() {
    return this._isInactive;
  }

  private _isFinished = false;
  get isFinished() {
    return this._isFinished;
  }

  private _startTime: DOMHighResTimeStamp;

  private _results: TimeBucketResult[] = [];
  get results(): TimeBucketResult[] {
    return this._results.slice();
  }

  /**
   *
   * @param {MeasureOptions} options
   */
  constructor(options: MeasureOptions) {
    const { name, timeBucketSize, interval, maxBuckets, isInactive } = options;
    this._name = name;
    this._markStartName = `${name}Start`;
    this._markEndName = `${name}End`;
    this._timeBucketSize =
      timeBucketSize || measureOptionsDefault.timeBucketSize;
    this._intervalInMilliseconds = interval || measureOptionsDefault.interval;
    this._maxBuckets = maxBuckets || measureOptionsDefault.maxBuckets;
    this._isInactive = isInactive ?? measureOptionsDefault.isInactive;
    this._isActive = !this._isInactive;
    this._startTime = perf.now();

    this.setupInterval();
  }

  finish() {
    this._calcResultsAndReset();
    if (this._interval) {
      clearInterval(this._interval);
    }
    this._isFinished = true;
    this._isActive = false;
  }

  /**
   * Should be called just before the desired measurement
   */
  public markStart(markOptions?: PerformanceMarkOptions): void {
    if (!this._isActive) {
      return;
    }

    perf.mark(this._markStartName, markOptions);
  }

  /**
   * Should be called to finish the measurement
   */
  public markEnd(
    markOptions?: PerformanceMarkOptions,
    measureOptions?: PerformanceMeasureOptions
  ): void {
    if (!this._isActive) {
      return;
    }

    perf.mark(this._markEndName, markOptions);
    if (measureOptions) {
      perf.measure(this._name, measureOptions);
    } else {
      perf.measure(this._name, this._markStartName, this._markEndName);
    }
  }

  /**
   * returns a PerformanceMeasure list of the measurements specific to the container
   */
  public getMeasures(): PerformanceMeasure[] {
    if (!this._isActive) {
      return [];
    }

    return perf.getEntriesByName(this._name) as PerformanceMeasure[];
  }

  private _prepareResultBuckets(endTime: number): void {
    const lastBucketNumber = Math.floor(
      (endTime - this._startTime) / this._timeBucketSize
    );
    for (let i = 0; i <= lastBucketNumber; i += 1) {
      if (!this._results[i]) {
        this._results[i] = {
          startTime: this._startTime + i * this._timeBucketSize,
          average: 0,
          count: 0,
          measures: [],
        };
      }
    }
  }

  private _addMeasureToBucket(measure: PerformanceMeasure) {
    const currentBucket = Math.floor(
      (measure.startTime - this._startTime) / this._timeBucketSize
    );
    const bucket = this._results[currentBucket];
    bucket.measures.push(measure);
    bucket.count += 1;
  }

  private static _calcBucketAverage(bucket: TimeBucketResult) {
    let measuresSum = 0;
    for (const measure of bucket.measures) {
      measuresSum += measure.duration;
    }
    bucket.average = measuresSum / bucket.count;
  }

  /**
   * returns a list of averages per time bucket
   * for example if the time bucket is 1000, i.e. one second, a list will be returned of 1 second averages
   */
  private _calcResultsForTimeBucket(): void {
    if (!this._isActive) {
      return;
    }

    const measures = this.getMeasures();
    const times = measures.map((measure) => measure.startTime);
    const endTime = Math.max(...times);
    this._prepareResultBuckets(endTime);
    // iterate over measures and add to buckets
    for (const measure of measures) {
      this._addMeasureToBucket(measure);
    }
    // iterate over buckets and calculate
    for (const bucket of this._results) {
      if (bucket.count) {
        Measure._calcBucketAverage(bucket);
      }
    }
  }

  private _resetMarksAndMeasures() {
    perf.clearMarks(this._markStartName);
    perf.clearMarks(this._markEndName);
    perf.clearMeasures(this._name);
  }

  private _sliceResultsArray() {
    this._results = this._results.slice(-this._maxBuckets);
    this._startTime = this._results[0].startTime;
  }

  private _calcResultsAndReset(): void {
    // calculate averages and counts
    this._calcResultsForTimeBucket();
    // reset measures from performance object
    this._resetMarksAndMeasures();
    // check how many bucket results there are and keep only the latest
    if (this._results.length > this._maxBuckets) {
      this._sliceResultsArray();
    }
  }

  private setupInterval() {
    if (!this._isActive) {
      return;
    }
    this._interval = (setInterval as typeof window["setInterval"])(() => {
      this._calcResultsAndReset();
    }, this._intervalInMilliseconds);
  }
}
