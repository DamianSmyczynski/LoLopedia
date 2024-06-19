export class ChampionNotFoundError extends Error {
  constructor(id: string) {
    super(`Champion name: ${id} not found`);
  }
}
