export class SummonerSpellNotFoundError extends Error {
  constructor(id: string) {
    super(`Summoner spell id: ${id} not found`);
  }
}
