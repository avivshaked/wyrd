// define the global object in a way that works in and out of the browser
export const globalObj: Global | Window | {} =
  // @ts-ignore
  typeof global !== "undefined"
    ? global
    : typeof self !== "undefined"
    ? self
    : typeof window !== "undefined"
    ? window
    : {};
