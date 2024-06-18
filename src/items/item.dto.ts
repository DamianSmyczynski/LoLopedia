import { Image } from 'src/image.type';

export type BasicItemDto = {
  id: string;
  name: string;
};

export type ItemDto = BasicItemDto & {
  version: string;
  language: string;
  description: string;
  colloq: string;
  from?: string[];
  into?: string[];
  image: Image;
  gold: ItemGold;
  tags: string[];
  maps: RiotMap;
  inStore: boolean;
  category?: string;
  depth: number;
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
