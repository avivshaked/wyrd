import { MeasureOptions } from "./MeasureOptions";
import { OptionsDefault } from "./OptionsDefault";

export const measureOptionsDefault: OptionsDefault<MeasureOptions, "name"> = {
  timeBucketSize: 1000,
  maxSamples: 1000,
  maxMeasures: 100,
  isInactive: false,
};
