import { Entity, BaseEntity, PrimaryColumn, Column } from 'typeorm';

@Entity('runes')
export class RuneEntity extends BaseEntity {
  @PrimaryColumn({ default: 'unique_id' })
  unique_id: string;

  @Column({ default: 'id' })
  id: string;

  @Column({ default: 'name' })
  name: string;

  @Column({ default: 'en' })
  language: string;

  @Column({ default: 'iconUrl' })
  iconUrl: string;
}
