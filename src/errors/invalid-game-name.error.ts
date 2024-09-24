export class InvalidGameNameStructureError extends Error {
  constructor() {
    super('Game name structure must be: gameName-tagLine');
  }
}
