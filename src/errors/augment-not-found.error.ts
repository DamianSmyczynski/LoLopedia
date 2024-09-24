export class AugmentNotFoundError extends Error {
  constructor(id: string) {
    super(`Augment id: ${id} not found`);
  }
}
