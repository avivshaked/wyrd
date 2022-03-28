import { MeasureOptions } from "./MeasureOptions";
import { OptionsDefault } from "./OptionsDefault";

export const measureOptionsDefault: OptionsDefault<MeasureOptions, "name"> = {
  timeBucketSize: 1000,
  interval: 2000,
  maxBuckets: 100,
  isInactive: false,
};
