import { HttpException, HttpStatus } from '@nestjs/common';
import { AccountNotFoundError } from '../../errors/account-not-found.error';
import { ChampionNotFoundError } from '../../errors/champion-not-found.error';
import { InvalidGameNameStructureError } from '../../errors/invalid-game-name.error';
import { ItemNotFoundError } from '../../errors/item-not-found.error';
import { StartValueOutOfRangeError } from 'src/errors/starting-value-out-of-range.error';
import { GamesCountIsTooHighError } from 'src/errors/games-count-is-too-hight.error';
import { AugmentNotFoundError } from 'src/errors/augment-not-found.error';
import { RuneNotFoundError } from 'src/errors/rune-not-found.error';
import { SummonerSpellNotFoundError } from 'src/errors/summoner-spell-not-found.error';

export class ErrorToApiErrorMapper {
  public static map(error: any) {
    switch (error.constructor) {
      case AccountNotFoundError:
      case AugmentNotFoundError:
      case ChampionNotFoundError:
      case ItemNotFoundError:
      case RuneNotFoundError:
      case SummonerSpellNotFoundError:
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      case InvalidGameNameStructureError:
      case StartValueOutOfRangeError:
      case GamesCountIsTooHighError:
        throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY);

      default:
        throw error;
    }
  }
}
