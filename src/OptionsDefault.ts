/**
 * Helper type
 * Makes it easier to define defaults to an options object
 * It's used when some properties in the options objet are to be dropped, usually the ones that are not optional
 * (since the must be provided by the consumer), and makes the rest of the properties as non-optional,
 * so values have to be provided for them and can be used as default values
 *
 * If multiple properties are to be dropped from the type, use Pipe
 * for example: ```const measureOptionsDefault: OptionsDefault<MeasureOptions, "name" | "timeBucketSize">```
 */
export type OptionsDefault<OpType, PropOmits extends keyof OpType> = Required<
  Omit<OpType, PropOmits>
>;
