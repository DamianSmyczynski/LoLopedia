import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { MainParticipantDto } from '../dto/basic-game/main-participant.dto';
import { BasicParticipantDto } from '../dto/basic-game/basic-participant.dto';
import { BasicItemDto } from 'src/items/item.dto';

@Entity('game')
export class GameEntity extends BaseEntity {
  @PrimaryColumn()
  match_id: string;

  @Column({ default: null })
  language: string;

  @Column({ default: null })
  puuid: string;

  @Column({ default: null })
  server: string;

  @Column({ type: 'timestamp', default: null })
  game_date: Date;

  @Column({ default: null })
  game_duration_time: number;

  @Column({ default: null })
  game_mode: string;

  @Column({ default: null })
  game_type: string;

  @Column({ type: 'simple-json', default: null })
  main_basic_participant: MainParticipantDto;

  @Column({ type: 'simple-json', default: null })
  other_basic_participants: BasicParticipantDto[];

  @Column({ type: 'simple-json', default: null })
  main_participant_items: BasicItemDto[];

  @Column({ type: 'simple-json', default: null })
  blue_team_kda: { kills: number; deaths: number; assists: number };

  @Column({ type: 'simple-json', default: null })
  red_team_kda: { kills: number; deaths: number; assists: number };

  @Column({ default: null })
  win: boolean;
}
