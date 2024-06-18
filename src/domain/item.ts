import { Image } from './image';
import { ItemGold } from './item-gold';
import { Maps } from './maps';

export class Item {
  constructor(
    private id: string,
    private name: string,
    private version: string,
    private language: string,
    private description: string,
    private colloq: string,
    private image: Image,
    private gold: ItemGold,
    private tags: string[],
    private maps: Maps,
    private inStore: boolean,
    private depth: number,
    private category?: string,
    private from?: string[],
    private into?: string[],
  ) {}

  public isAvailableOnSummonersRift(): boolean {
    return this.id.length <= 5 && this.maps['11'] === true;
  }

  public updateFromRiot() {}
}
