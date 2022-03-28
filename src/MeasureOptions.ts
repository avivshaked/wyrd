export interface MeasureOptions {
  /**
   * The name of the measure. It needs to be unique though it is not enforced.
   */
  name: string;
  /**
   * Defines the bucket time in milliseconds
   * The time bucket is the duration of time in which an average measurement is registered
   *
   * Default is 1000 (i.e. 1 second)
   */
  timeBucketSize?: number;
  /**
   * How often should a calculation be made, in milliseconds
   * Default is 2000
   */
  interval?: number;
  /**
   * The Measure objects saves all latest measurements. It keeps a limited number of them.
   * This defines the limit.
   * Default is 100
   */
  maxMeasures?: number;
  /**
   * There might be cases where it is desired that the Measure does nothing. For example it might not be desirable for
   * the measures to run on production. When this option is set to true, the Measure becomes inert, and all methods
   * return immediately.
   * Default is false
   */
  isInactive?: boolean;
}
