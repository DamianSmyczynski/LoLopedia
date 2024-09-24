import { Entity, BaseEntity, PrimaryColumn, Column } from 'typeorm';

@Entity('augments')
export class AugmentEntity extends BaseEntity {
  @PrimaryColumn({ default: 'unique_id' })
  unique_id: string;

  @Column({ default: 'id' })
  id: string;

  @Column({ default: 'en' })
  language: string;

  @Column({ default: 'name' })
  name: string;

  @Column({ default: 'iconSmallUrl' })
  iconSmallUrl: string;

  @Column({ default: 'iconSmallUrl' })
  iconLargeUrl: string;
}
