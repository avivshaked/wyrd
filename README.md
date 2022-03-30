# Wyrd

Wyrd is a tool for measuring performance of specific areas or functions in your application for a specific time bucket.

## Table of contents
  - [What is a wyrd](#what-is-a-wyrd)
  - [Motivation](#motivation)
  - [Installing](#installing)
  - [Example](#example)
## What is a wyrd?
From [Wikipedia](https://en.wikipedia.org/wiki/Wyrd);
> Wyrd is a feminine noun, and its Norse cognate urðr, besides meaning "fate", is the name of one of the Norns; urðr is literally "that which has come to pass".

## Motivation
In certain applications, for example a canvas application, there is often a need to discover how many times a function is called, or how much time on average is spent on that function.
That is what this tool tries to solve. With this tool it is possible to iteratively identify the bottlenecks in your application.

## Installing
Using npm:
```bash
npm install wyrd
```
Using yarn:
```bash
yarn add wyrd
```
Using unpkg CDN:
```html
<script src="https://unpkg.com/wyrd/dist/index.umd.js"></script>
```

## Example

### note: ES Module example
Get the Wyrd object

```typescript
import { Wyrd } from "wyrd";
```
Alternatively you can get measureManager object, which is the same object.

```typescript
import { measureManager } from ".wyrd";
```
With this object you can register a measures.
```typescript
Wyrd.registerMeasure("measure-some-action");
```
Around the function execution you can mark start and end
```typescript
function someFn() {
    Wyrd.markMeasureStart("measure-some-action");
    // this is some repeating function that you'd like to know how much time 
    // it spent on average in a given time bucket
    actionToMeasure();
    Wyrd.markMeasureEnd("measure-some-action");
}
```
At any time in the console, you can access this measurement
```js
    const results = Wyrd.getResults("measure-some-action");
```
The results are a list of [TimeBucketResult](./dist/types/TimeBucketResult.d.ts) .
They can be logged in the console, or sent to be collected elsewhere.

A [Measure](./dist/types/Measure.d.ts) can be accessed directly
```typescript
    const measure = Wyrd.getMeasures("measure-some-action");
```

If a measure is no longer needed, it can be finished (in which case no further measurements will occur).
```typescript
    let isFinished = Wird.getMeasure("measure-some-action").isFinished // should be false
    Wyrd.finishMeasure("measure-some-action");
    isFinished = Wird.getMeasure("measure-some-action").isFinished // should be true
```
