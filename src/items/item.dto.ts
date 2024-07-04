import { Image } from 'src/image.type';

export type BasicItemDto = {
  version: string;
  id: string;
  name: string;
  category?: string;
};

export type ItemDto = BasicItemDto & {
  language: string;
  description: string;
  colloq: string;
  image: Image;
  gold: ItemGold;
  tags: string[];
  maps: RiotMap;
  inStore: boolean;
  depth: number;
  plaintext: string;
  stats: ItemStat[];
  from?: string[];
  into?: string[];
  requiredChampion?: string;
};

export type ItemGold = {
  base: number;
  purchasable: boolean;
  total: number;
  sell: number;
};

export type RiotMap = {
  11: boolean;
  12: boolean;
  21: boolean;
  22: boolean;
  30: boolean;
};

export type ItemStat = {
  name: string;
  value: number;
};
