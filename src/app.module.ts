import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { Inject, Module } from '@nestjs/common';
import { HttpRiotService } from './infrastructure/riot/http-riot.service';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { AppSymbol } from './app.symbol';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountEntity } from './accounts/account.entity';
import { AugmentEntity } from './augments/augment.entity';
import { GameEntity } from './games/entities/game.entity';
import { ChampionEntity } from './champions/champion.entity';
import { ItemEntity } from './items/item.entity';
import { RuneEntity } from './runes/rune.entity';
import { SummonerSpellEntity } from './summoner-spells/summoner-spell.entity';

import { AccountController } from './controllers/account.controller';
import { AugmentController } from './controllers/augment.controller';
import { ChampionController } from './controllers/champion.controller';
import { GameController } from './controllers/game.controller';
import { ItemController } from './controllers/item.controller';
import { MasteryController } from './controllers/mastery.controller';
import { PatchVersionController } from './controllers/patch-version.controller';
import { RuneController } from './controllers/rune.controller';
import { SummonerSpellController } from './controllers/summoner-spell.controller';

import { AccountService } from './services/account/account.service';
import { AugmentService } from './services/Augment/Augment.service';
import { ChampionsService } from './services/champion/champion.service';
import { GameService } from './services/game/game.service';
import { ItemService } from './services/item/item.service';
import { ItemBuildTreeService } from './services/item/item-build-tree.service';
import { ItemCategoryService } from './services/item/item-category.service';
import { ItemFilterService } from './services/item/item-filter.service';
import { ItemStatsService } from './services/item/item-stats.service';
import { MasteryService } from './services/mastery/mastery.service';
import { PatchVersionService } from './services/patch-version/patch-version.service';
import { RuneService } from './services/Rune/Rune.service';
import { SummonerSpellService } from './services/summoner-spell/summoner-spell.service';

import { HttpRiotPatchVersionService } from './infrastructure/riot/services/patch-version/http-riot-patch-version.service';
import { CacheRiotPatchVersionService } from './infrastructure/riot/services/patch-version/cache-riot-patch-version.service';

import { MySqlRiotAccountService } from './infrastructure/riot/services/mysql-riot-account.service';
import { MySqlRiotAugmentService } from './infrastructure/riot/services/mysql-riot-augment.service';
import { MySqlRiotChampionService } from './infrastructure/riot/services/mysql-riot-champion.service';
import { MySqlRiotGameService } from './infrastructure/riot/services/mysql-riot-game.service';
import { MySqlRiotItemService } from './infrastructure/riot/services/mysql-riot-item.service';
import { MySqlRiotRuneService } from './infrastructure/riot/services/mysql-riot-rune.service';
import { MySqlRiotSummonerSpellService } from './infrastructure/riot/services/mysql-riot-summoner-spell.service';

import { GameToBasicGameDetailsMapper } from './infrastructure/riot/mappers/game/game-to-basic-game-details.mapper';
import { GameToDetailedGameMapper } from './infrastructure/riot/mappers/game/game-to-detailed-game.mapper';
import { HttpRiotMasteryResponseToBasicMasteryDataMapper } from './infrastructure/riot/mappers/mastery';
import { GameToGameTimelineMapper } from './infrastructure/riot/mappers/game';

import 'dotenv/config';

@Module({
  imports: [
    HttpModule,
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [
        AccountEntity,
        AugmentEntity,
        GameEntity,
        ChampionEntity,
        ItemEntity,
        RuneEntity,
        SummonerSpellEntity,
      ],
      extra: {
        charset: 'utf8mb4_unicode_ci',
      },
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      AccountEntity,
      AugmentEntity,
      GameEntity,
      ChampionEntity,
      ItemEntity,
      RuneEntity,
      SummonerSpellEntity,
    ]),
  ],
  controllers: [
    AppController,
    AccountController,
    AugmentController,
    ChampionController,
    GameController,
    ItemController,
    MasteryController,
    PatchVersionController,
    RuneController,
    SummonerSpellController,
  ],
  providers: [
    AppService,
    HttpRiotService,
    AccountService,
    AugmentService,
    ChampionsService,
    GameService,
    ItemService,
    ItemBuildTreeService,
    ItemCategoryService,
    ItemFilterService,
    ItemStatsService,
    MasteryService,
    PatchVersionService,
    RuneService,
    SummonerSpellService,
    HttpRiotPatchVersionService,
    {
      provide: AppSymbol.PatchVersionRepository,
      useClass: CacheRiotPatchVersionService,
    },
    {
      provide: AppSymbol.RiotAccountRepository,
      useClass: MySqlRiotAccountService,
    },
    {
      provide: AppSymbol.RiotAugmentRepository,
      useClass: MySqlRiotAugmentService,
    },
    {
      provide: AppSymbol.RiotChampionRepository,
      useClass: MySqlRiotChampionService,
    },
    {
      provide: AppSymbol.RiotGameRepository,
      useClass: MySqlRiotGameService,
    },
    {
      provide: AppSymbol.RiotItemRepository,
      useClass: MySqlRiotItemService,
    },
    {
      provide: AppSymbol.RiotRuneRepository,
      useClass: MySqlRiotRuneService,
    },
    {
      provide: AppSymbol.RiotSummonerSpellRepository,
      useClass: MySqlRiotSummonerSpellService,
    },
    GameToBasicGameDetailsMapper,
    GameToDetailedGameMapper,
    GameToGameTimelineMapper,
    HttpRiotMasteryResponseToBasicMasteryDataMapper,
  ],
})
export class AppModule {
  constructor(@Inject(CACHE_MANAGER) cacheManager) {
    const client = cacheManager.store.getClient();

    client.on('error', (error) => {
      if (process.env.FF_USE_REDIS === '1') {
        console.log(error);
      }
    });
  }
}
