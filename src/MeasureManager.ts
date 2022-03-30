import { MeasureManagerOptions } from "./MeasureManagerOptions";
import { measureManagerDefaults } from "./measureManagerDefaults";
import { globalObj } from "./globalObj";
import { Measure } from "./Measure";
import { MeasureOptions } from "./MeasureOptions";
import { TimeBucketResult } from "./TimeBucketResult";

export class MeasureManager {
  private _globalName: string;
  get globalName(): string {
    return this._globalName;
  }

  private _shouldBeOnGlobal: boolean;
  private readonly _measures: Map<string, Measure> = new Map();

  constructor(options: MeasureManagerOptions = {}) {
    const { globalName, shouldBeOnGlobal } = options;

    this._globalName = globalName ?? measureManagerDefaults.globalName;
    if (this._globalName === "") {
      this._globalName = measureManagerDefaults.globalName;
    }
    this._shouldBeOnGlobal =
      shouldBeOnGlobal ?? measureManagerDefaults.shouldBeOnGlobal;

    if (this._shouldBeOnGlobal) {
      this._mountInstanceOnGlobal();
    }
  }

  private _mountInstanceOnGlobal() {
    let safeOnGlobal = false;
    // mounting the instance on the global should not override other objects on the global
    // this will check if the namespace is free. if not, it will add '_' to the start of the name
    // until it finds a free namespace
    while (!safeOnGlobal) {
      if (
        (globalObj as { [key: string]: any })[this._globalName] !== undefined
      ) {
        this._globalName = "_" + this._globalName;
      } else {
        safeOnGlobal = true;
        (globalObj as { [key: string]: any })[this._globalName] = this;
      }
    }
  }

  /**
   * The default is to place the manager object on the global object for easy access from the console.
   * If this is not desired, the manager can be removed from the global using this method.
   */
  public removeFromGlobal() {
    delete (globalObj as { [key: string]: any })[this._globalName];
    this._shouldBeOnGlobal = false;
  }

  public isOnGlobal(): boolean {
    return (
      (globalObj as { [key: string]: any })[this._globalName] !== undefined
    );
  }

  /**
   * Returns a specific Measure
   * @param {string} name
   */
  public getMeasure(name: string): Measure | null {
    return this._measures.get(name) || null;
  }

  public registerMeasure(name: string): boolean;
  public registerMeasure(options: MeasureOptions): boolean;
  /**
   * Register a name for a new series of measurements. The name should be unique.
   * If a measure name is repeated, the returned value will be false.
   * If a unique name was used, the return value is true.
   *
   * @param {string | MeasureOptions} nameOrOptions
   */
  public registerMeasure(nameOrOptions: string | MeasureOptions): boolean {
    let name: string;
    if (typeof nameOrOptions === "string") {
      name = nameOrOptions;
    } else {
      name = nameOrOptions.name;
    }

    if (this._measures.has(name)) {
      return false;
    }

    let measure: Measure;
    if (typeof nameOrOptions === "string") {
      measure = new Measure({ name: nameOrOptions });
    } else {
      measure = new Measure(nameOrOptions);
    }

    this._measures.set(name, measure);
    return true;
  }

  /**
   * Removes a Measure from the manager
   * Before removing it, measure.finish will be called
   * @param {string} name
   * @returns {boolean} true if successfully removed, false if Measure was not found
   */
  public removeMeasure(name: string): boolean {
    const measure = this.getMeasure(name);
    if (measure) {
      if (!measure.isFinished) {
        measure.finish();
      }
      this._measures.delete(name);
      return true;
    } else {
      return false;
    }
  }

  /**
   * Orders a Measure to stop measuring. That measure is still accessible, but is no longer measuring.
   * @param {string} name
   * @return {boolean} true if a Measure was successfully finished. False is the Measure was not found.
   */
  public finishMeasure(name: string): boolean {
    const measure = this.getMeasure(name);
    if (measure) {
      measure.finish();
      return true;
    } else {
      return false;
    }
  }

  /**
   * Marks a measure start.
   *
   * @param {string} name
   * @param {PerformanceMarkOptions} options
   * @return {boolean} true if a Measure has successfully marked start. False is the Measure was not found.
   */
  public markMeasureStart(
    name: string,
    options?: PerformanceMarkOptions
  ): boolean {
    const measure = this.getMeasure(name);
    if (measure) {
      measure.markStart(options);
      return true;
    } else {
      return false;
    }
  }

  /**
   * Marks a measure end. Essentially finished the span and allows the sample to be added (eventually)
   *
   * @param {string} name
   * @param {PerformanceMarkOptions} markOptions
   * @param {PerformanceMeasureOptions} measureOptions
   * @return {boolean} true if a Measure has successfully marked end. False is the Measure was not found.
   */
  public markMeasureEnd(
    name: string,
    markOptions?: PerformanceMarkOptions,
    measureOptions?: PerformanceMeasureOptions
  ): boolean {
    const measure = this.getMeasure(name);
    if (measure) {
      measure.markEnd(markOptions, measureOptions);
      return true;
    } else {
      return false;
    }
  }

  /**
   * returns the list of PerformanceMeasure currently on the performance object for this Measure
   * returns null if the Measure is not found
   *
   * @param {string} name
   */
  public getSamples(name: string): PerformanceMeasure[] | null {
    const measure = this.getMeasure(name);
    if (measure) {
      return measure.getSamples();
    } else {
      return null;
    }
  }

  /**
   * returns a list of TimeBucketResults for this Measure
   * returns null if the Measure is not found
   *
   * @param {string} name
   */
  public getResults(name: string): TimeBucketResult[] | null {
    const measure = this.getMeasure(name);
    if (measure) {
      return measure.results;
    } else {
      return null;
    }
  }

  /**
   * Returns the map of all measures taken by this manager
   */
  public getMeasuresMap(): Map<string, Measure> {
    return this._measures;
  }

  /**
   * Returns a list of all measures taken by this manager
   */
  public getMeasures(): Measure[] {
    return Array.from(this._measures.values());
  }
}
