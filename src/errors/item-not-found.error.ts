export class ItemNotFoundError extends Error {
  constructor(id: string) {
    super(`Item id: ${id} not found`);
  }
}
