import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BasicGameDto } from '../../../games/dto/basic-game/basic-game.dto';
import { GameEntity } from '../../../games/entities/game.entity';
import { RiotGameRepositoryInterface } from '../interfaces/riot-game-repository.interface';
import {
  BasicGameToGameEntityMapper,
  GameEntityToBasicGameMapper,
} from '../mappers/game';

@Injectable()
export class MySqlRiotGameService implements RiotGameRepositoryInterface {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
  ) {}

  public async getAllByPuuid(puuid: string): Promise<BasicGameDto[]> {
    const games: BasicGameDto[] = (
      await this.gameRepository.findBy({
        puuid: puuid,
      })
    ).map(GameEntityToBasicGameMapper.map);

    return games;
  }

  public async getGamesFromRange(puuid: string, start: number, count: number) {
    const games: BasicGameDto[] = (
      await this.gameRepository.find({
        where: { puuid },
        order: {
          match_id: 'DESC',
        },
        skip: start,
        take: count,
      })
    ).map(GameEntityToBasicGameMapper.map);

    return games;
  }

  public async save(game: BasicGameDto) {
    await this.gameRepository.save(BasicGameToGameEntityMapper.map(game));
  }

  public async updateList(games: BasicGameDto[]) {
    for (const [key, value] of Object.entries(games)) {
      await this.gameRepository.save(BasicGameToGameEntityMapper.map(value));
    }

    console.log('Data updated!');
  }

  public async updateGameIds(gamesIds: string[], puuid: string) {
    for (const [key, value] of Object.entries(gamesIds)) {
      await this.gameRepository.save(
        BasicGameToGameEntityMapper.map({
          matchId: value,
          puuid: puuid,
        } as BasicGameDto),
      );
    }
    console.log('Games ids updated!');
  }
}
