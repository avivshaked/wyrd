import { MeasureManager } from "./MeasureManager";
export { MeasureManager } from "./MeasureManager";
import { MeasureManagerOptions } from "./MeasureManagerOptions";
export { MeasureManagerOptions } from "./MeasureManagerOptions";
export { TimeBucketResult } from "./TimeBucketResult";
export { MeasureOptions } from "./MeasureOptions";
export { Measure } from "./Measure";
export const measureManager = new MeasureManager();
export const Wyrd = measureManager;

export function createCustomMeasureManager(
  options?: MeasureManagerOptions
): MeasureManager {
  if (measureManager.isOnGlobal()) {
    measureManager.removeFromGlobal();
  }
  return new MeasureManager(options);
}
