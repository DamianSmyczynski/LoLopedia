import { HttpException, HttpStatus } from '@nestjs/common';
import { AccountNotFoundError } from 'src/errors/account-not-found.error';
import { ChampionNotFoundError } from 'src/errors/champion-not-found.error';
import { ItemNotFoundError } from 'src/errors/item-not-found.error';

export class ErrorToApiErrorMapper {
  public static map(error: any) {
    switch (error.constructor) {
      case AccountNotFoundError:
      case ChampionNotFoundError:
      case ItemNotFoundError:
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
