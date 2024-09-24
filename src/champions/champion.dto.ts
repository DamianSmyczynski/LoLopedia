import { Image } from '../image.type';

export type BasicChampionDto = {
  id: string;
  name: string;
};

export type ChampionDto = BasicChampionDto & {
  language: string;
  version: string;
  key: string;
  title: string;
  blurb: string;
  info: ChampionInfo;
  image: Image;
  tags: string[];
  partype: string;
  stats: ChampionStats;
  skins: ChampionSkin[];
  lore: string;
  spells: ChampionSpell[];
  passive: BasicChampionSpell;
};

export type ChampionInfo = {
  attack: number;
  defense: number;
  magic: number;
  difficulty: number;
};

export type ChampionStats = {
  hp: number;
  hpperlevel: number;
  mp: number;
  mpperlevel: number;
  movespeed: number;
  armor: number;
  armorperlevel: number;
  spellblock: number;
  spellblockperlevel: number;
  attackrange: number;
  hpregen: number;
  hpregerperlevel: number;
  mpregen: number;
  mpregenperlevel: number;
  crit: number;
  critperlevel: number;
  attackdamage: number;
  attackdamageperlevel: number;
  attackspeedperlevel: number;
  attackspeed: number;
};

export type ChampionSkin = {
  id: string;
  num: number;
  name: string;
  chromas: boolean;
};

export type BasicChampionSpell = {
  name: string;
  description: string;
  image: Image;
};

export type ChampionSpell = BasicChampionSpell & {
  id: string;
};
