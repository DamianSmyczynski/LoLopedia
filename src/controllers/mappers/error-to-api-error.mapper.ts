import { HttpException, HttpStatus } from '@nestjs/common';
import { ChampionNotFoundError } from 'src/errors/champion-not-found.error';
import { ItemNotFoundError } from 'src/errors/item-not-found.error';

export class ErrorToApiErrorMapper {
  public static map(error: any) {
    switch (error.constructor) {
      case ItemNotFoundError:
      case ChampionNotFoundError:
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
