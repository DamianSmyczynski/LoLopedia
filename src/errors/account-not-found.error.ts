export class AccountNotFoundError extends Error {
  constructor(gameName: string) {
    super(`Account: ${gameName} not found`);
  }
}
