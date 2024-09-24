import { Entity, BaseEntity, PrimaryColumn, Column } from 'typeorm';

@Entity('summoner-spells')
export class SummonerSpellEntity extends BaseEntity {
  @PrimaryColumn({ default: 'unique_id' })
  unique_id: string;

  @Column({ default: 'en' })
  language: string;

  @Column({ default: 'id' })
  id: string;

  @Column({ default: 'name' })
  name: string;

  @Column({ default: 'url' })
  url: string;
}
