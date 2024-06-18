import { Entity, BaseEntity, PrimaryColumn, Column } from 'typeorm';

@Entity('items')
export class ItemEntity extends BaseEntity {
  @PrimaryColumn({ default: 'unique_id' })
  unique_id: string;

  @Column({ default: 'en' })
  language: string;

  @Column()
  version: string;

  @Column()
  id: string;

  @Column()
  name: string;

  @Column('varchar', { length: 2000 })
  description: string;

  @Column()
  colloq: string;

  @Column('simple-array', { default: null })
  from: string[];

  @Column('simple-array', { default: null })
  into: string[];

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

  @Column('simple-json')
  gold: { base: number; purchasable: boolean; total: number; sell: number };

  @Column('simple-array', { default: null })
  tags: string[];

  @Column('simple-json')
  maps: { 11: boolean; 12: boolean; 21: boolean; 22: boolean; 30: boolean };

  @Column({ default: null })
  inStore: boolean;

  @Column({ default: null })
  category: string;

  @Column({ default: null })
  depth: number;
}
