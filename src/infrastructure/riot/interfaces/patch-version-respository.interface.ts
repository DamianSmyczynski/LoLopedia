export interface PatchVersionRepositoryInterface {
  getNewest(): Promise<string>;
}
