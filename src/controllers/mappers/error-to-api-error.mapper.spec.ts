import { InvalidGameNameStructureError } from '../../errors/invalid-game-name.error';
import { AccountNotFoundError } from '../../errors/account-not-found.error';
import { ChampionNotFoundError } from '../../errors/champion-not-found.error';
import { ItemNotFoundError } from '../../errors/item-not-found.error';
import { ErrorToApiErrorMapper } from './error-to-api-error.mapper';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ErrorToApiErrorMapper', () => {
  it('should throw HttpException with 404 status for AccountNotFoundError', () => {
    const error = new AccountNotFoundError('accountId');

    expect(() => ErrorToApiErrorMapper.map(error)).toThrow(
      new HttpException('Account: accountId not found', HttpStatus.NOT_FOUND),
    );
  });

  it('should throw HttpException with 404 status for ChampionNotFoundError', () => {
    const error = new ChampionNotFoundError('championName');

    expect(() => ErrorToApiErrorMapper.map(error)).toThrow(
      new HttpException(
        'Champion name: championName not found',
        HttpStatus.NOT_FOUND,
      ),
    );
  });

  it('should throw HttpException with 404 status for ItemNotFoundError', () => {
    const error = new ItemNotFoundError('itemId');

    expect(() => ErrorToApiErrorMapper.map(error)).toThrow(
      new HttpException('Item id: itemId not found', HttpStatus.NOT_FOUND),
    );
  });

  it('should throw HttpException with 422 status for InvalidGameNameStructureError', () => {
    const error = new InvalidGameNameStructureError();

    expect(() => ErrorToApiErrorMapper.map(error)).toThrow(
      new HttpException(
        'Game name structure must be: gameName-tagLine',
        HttpStatus.UNPROCESSABLE_ENTITY,
      ),
    );
  });

  it('should throw for an unknown error type', () => {
    const error = new Error('Unknown error');

    expect(() => ErrorToApiErrorMapper.map(error)).toThrow();
  });
});
