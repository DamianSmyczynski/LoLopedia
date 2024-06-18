import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('champions')
export class ChampionEntity extends BaseEntity {
  @PrimaryColumn({ default: 'unique_id' })
  unique_id: string;

  @Column({ default: 'en' })
  language: string;

  @Column()
  version: string;

  @Column()
  id: string;

  @Column()
  key: string;

  @Column()
  name: string;

  @Column()
  title: string;

  @Column('varchar', { length: 2000 })
  blurb: string;

  @Column('simple-json')
  info: { attack: number; defense: number; magic: number; difficulty: number };

  @Column('simple-json')
  image: {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };

  @Column('simple-array')
  tags: string[];

  @Column()
  partype: string;

  @Column('simple-json')
  stats: {
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

  @Column({ type: 'simple-json', nullable: true })
  skins: { id: string; num: number; name: string; chromas: boolean }[];

  @Column('varchar', { length: 2000, default: true })
  lore: string;

  @Column({ type: 'simple-json', nullable: true })
  spells: {
    id: string;
    name: string;
    description: string;
    image: {
      full: string;
      sprite: string;
      group: string;
      x: number;
      y: number;
      w: number;
      h: number;
    };
  }[];

  @Column({ type: 'simple-json', nullable: true })
  passive: {
    name: string;
    description: string;
    image: {
      full: string;
      sprite: string;
      group: string;
      x: number;
      y: number;
      w: number;
      h: number;
    };
  };
}
