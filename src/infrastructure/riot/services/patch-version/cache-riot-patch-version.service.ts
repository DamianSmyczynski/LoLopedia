import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { PatchVersionRepositoryInterface } from '../../interfaces/patch-version-respository.interface';
import { Cache } from 'cache-manager';
import { HttpRiotPatchVersionService } from './http-riot-patch-version.service';

import 'dotenv/config';

const DEFAULT_TTL = 3600000;

@Injectable()
export class CacheRiotPatchVersionService
  implements PatchVersionRepositoryInterface
{
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly httpRiotPatchVersionService: HttpRiotPatchVersionService,
  ) {}

  public async getNewest(): Promise<string> {
    if (process.env.FF_USE_REDIS === '0') {
      return this.httpRiotPatchVersionService.getNewest();
    }
    const key = 'newest';
    let newestVersion: string = await this.cacheManager.get(key);
    if (newestVersion) {
      return newestVersion;
    }

    newestVersion = await this.httpRiotPatchVersionService.getNewest();

    this.cacheManager.set(
      key,
      newestVersion,
      process.env.REDIS_PATCH_VERSION_TTL ?? DEFAULT_TTL,
    );

    return newestVersion;
  }
}
