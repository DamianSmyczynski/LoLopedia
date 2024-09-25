export class RegionNotFoundError extends Error {
  constructor(region: string) {
    super(`Region: ${region} not found`);
  }
}
