export class RuneNotFoundError extends Error {
  constructor(id: string) {
    super(`Rune id: ${id} not found`);
  }
}
