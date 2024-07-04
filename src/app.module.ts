import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpRiotService } from './infrastructure/riot/http-riot.service';
import { ChampionsService } from './services/champion.service';
import { AppSymbol } from './app.symbol';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChampionEntity } from './champions/champion.entity';
import 'dotenv/config';
import { MySqlRiotChampionService } from './infrastructure/riot/services/mysql-riot-champion.service';
import { ChampionController } from './controllers/champion.controller';
import { MySqlRiotItemService } from './infrastructure/riot/services/mysql-riot-item.service';
import { ItemEntity } from './items/item.entity';
import { ItemController } from './controllers/item.controller';
import { ItemService } from './services/item/item.service';
import { ItemBuildTreeService } from './services/item/item-build-tree.service';
import { ItemCategoryService } from './services/item/item-category.service';
import { ItemFilterService } from './services/item/item-filter.service';
import { ItemStatsService } from './services/item/item-stats.service';

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
      entities: [ChampionEntity, ItemEntity],
      extra: {
        charset: 'utf8mb4_unicode_ci',
      },
      synchronize: true,
    }),
    TypeOrmModule.forFeature([ChampionEntity, ItemEntity]),
  ],
  controllers: [AppController, ChampionController, ItemController],
  providers: [
    AppService,
    HttpRiotService,
    ChampionsService,
    ItemService,
    ItemBuildTreeService,
    ItemCategoryService,
    ItemFilterService,
    ItemStatsService,
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
