export interface MeasureManagerOptions {
  /**
   * When trying to get measurements, it might not be possible to get access to the manager outside the global.
   * By default the manager places itself on the global object as `Wyrd`
   * If that is not desired, this values should be set to false.
   *
   * Default value is true
   */
  shouldBeOnGlobal?: boolean;
  /**
   * By default the global name is Wyrd.
   * Change this if a different global name is desired
   */
  globalName?: string;
}
