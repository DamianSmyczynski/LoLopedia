export class StartValueOutOfRange extends Error {
  constructor(minValue: number, maxValue: number) {
    super(`Incorrect start value. (min: ${minValue}, max: ${maxValue})`);
  }
}