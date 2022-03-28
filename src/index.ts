import { MeasureManager } from "./MeasureManager";
import { MeasureManagerOptions } from "./MeasureManagerOptions";

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
