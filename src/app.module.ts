import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpRiotService } from './infrastructure/riot/http-riot.service';
import { AppSymbol } from './app.symbol';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountEntity } from './accounts/account.entity';
import { ChampionEntity } from './champions/champion.entity';
import { ItemEntity } from './items/item.entity';

import { AccountController } from './controllers/account.controller';
import { GameController } from './controllers/game.controller';
import { ItemController } from './controllers/item.controller';
import { ChampionController } from './controllers/champion.controller';
import { PatchVersionController } from './controllers/patch-version.controller';

import { AccountService } from './services/account/account.service';
import { ChampionsService } from './services/champion/champion.service';
import { ItemService } from './services/item/item.service';
import { ItemBuildTreeService } from './services/item/item-build-tree.service';
import { ItemCategoryService } from './services/item/item-category.service';
import { ItemFilterService } from './services/item/item-filter.service';
import { ItemStatsService } from './services/item/item-stats.service';

import { MySqlRiotAccountService } from './infrastructure/riot/services/mysql-riot-account.service';
import { MySqlRiotChampionService } from './infrastructure/riot/services/mysql-riot-champion.service';
import { MySqlRiotItemService } from './infrastructure/riot/services/mysql-riot-item.service';

import 'dotenv/config';
import { MasteryController } from './controllers/mastery.controller';
import { MasteryService } from './services/mastery/mastery.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'dm70579_root',
      password: process.env.DB_PASS,
      database: 'dm70579_riot',
      entities: [AccountEntity, ChampionEntity, ItemEntity],
      extra: {
        charset: 'utf8mb4_unicode_ci',
      },
      synchronize: true,
    }),
    TypeOrmModule.forFeature([AccountEntity, ChampionEntity, ItemEntity]),
  ],
  controllers: [
    AppController,
    AccountController,
    ChampionController,
    GameController,
    ItemController,
    MasteryController,
    PatchVersionController,
  ],
  providers: [
    AppService,
    HttpRiotService,
    AccountService,
    ChampionsService,
    ItemService,
    ItemBuildTreeService,
    ItemCategoryService,
    ItemFilterService,
    ItemStatsService,
    MasteryService,
    {
      provide: AppSymbol.RiotAccountRepository,
      useClass: MySqlRiotAccountService,
    },
    {
      provide: AppSymbol.RiotChampionRepository,
      useClass: MySqlRiotChampionService,
    },
    {
      provide: AppSymbol.RiotItemRepository,
      useClass: MySqlRiotItemService,
    },
  ],
})
export class AppModule {}
