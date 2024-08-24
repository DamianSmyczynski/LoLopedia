import { Entity, BaseEntity, PrimaryColumn, Column } from 'typeorm';

@Entity('accounts')
export class AccountEntity extends BaseEntity {
  @PrimaryColumn({ default: 'puuid' })
  puuid: string;

  @Column()
  region: string;

  @Column()
  game_name: string;

  @Column()
  simplified_game_name: string;

  @Column()
  tag_line: string;

  @Column()
  simplified_tag_line: string;

  @Column({ default: 1 })
  summoner_level: number;

  @Column({ default: 1 })
  profile_icon_id: number;

  @Column({ type: 'simple-json', nullable: true })
  solo_queue_rank: {
    leagueId: string;
    queueType: string;
    tier: string;
    rank: string;
    summonerId: string;
    leaguePoints: number;
    wins: number;
    losses: number;
    veteran: boolean;
    inactive: boolean;
    freshBlood: boolean;
    hotStreak: boolean;
  };

  @Column({ type: 'simple-json', nullable: true })
  flex_queue_rank: {
    leagueId: string;
    queueType: string;
    tier: string;
    rank: string;
    summonerId: string;
    leaguePoints: number;
    wins: number;
    losses: number;
    veteran: boolean;
    inactive: boolean;
    freshBlood: boolean;
    hotStreak: boolean;
  };

  @Column({ type: 'timestamp', nullable: true })
  last_reload_date: Date;
}
