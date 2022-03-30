import { MeasureManagerOptions } from "./MeasureManagerOptions";
import { Measure } from "./Measure";
import { MeasureOptions } from "./MeasureOptions";
import { TimeBucketResult } from "./TimeBucketResult";
export declare class MeasureManager {
    private _globalName;
    get globalName(): string;
    private _shouldBeOnGlobal;
    private readonly _measures;
    constructor(options?: MeasureManagerOptions);
    private _mountInstanceOnGlobal;
    /**
     * The default is to place the manager object on the global object for easy access from the console.
     * If this is not desired, the manager can be removed from the global using this method.
     */
    removeFromGlobal(): void;
    isOnGlobal(): boolean;
    /**
     * Returns a specific Measure
     * @param {string} name
     */
    getMeasure(name: string): Measure | null;
    registerMeasure(name: string): boolean;
    registerMeasure(options: MeasureOptions): boolean;
    /**
     * Removes a Measure from the manager
     * Before removing it, measure.finish will be called
     * @param {string} name
     * @returns {boolean} true if successfully removed, false if Measure was not found
     */
    removeMeasure(name: string): boolean;
    /**
     * Orders a Measure to stop measuring. That measure is still accessible, but is no longer measuring.
     * @param {string} name
     * @return {boolean} true if a Measure was successfully finished. False is the Measure was not found.
     */
    finishMeasure(name: string): boolean;
    /**
     * Marks a measure start.
     *
     * @param {string} name
     * @param {PerformanceMarkOptions} options
     * @return {boolean} true if a Measure has successfully marked start. False is the Measure was not found.
     */
    markMeasureStart(name: string, options?: PerformanceMarkOptions): boolean;
    /**
     * Marks a measure end. Essentially finished the span and allows the sample to be added (eventually)
     *
     * @param {string} name
     * @param {PerformanceMarkOptions} markOptions
     * @param {PerformanceMeasureOptions} measureOptions
     * @return {boolean} true if a Measure has successfully marked end. False is the Measure was not found.
     */
    markMeasureEnd(name: string, markOptions?: PerformanceMarkOptions, measureOptions?: PerformanceMeasureOptions): boolean;
    /**
     * returns the list of PerformanceMeasure currently on the performance object for this Measure
     * returns null if the Measure is not found
     *
     * @param {string} name
     */
    getSamples(name: string): PerformanceMeasure[] | null;
    /**
     * returns a list of TimeBucketResults for this Measure
     * returns null if the Measure is not found
     *
     * @param {string} name
     */
    getResults(name: string): TimeBucketResult[] | null;
    /**
     * Returns the map of all measures taken by this manager
     */
    getMeasuresMap(): Map<string, Measure>;
    /**
     * Returns a list of all measures taken by this manager
     */
    getMeasures(): Measure[];
}
//# sourceMappingURL=MeasureManager.d.ts.map