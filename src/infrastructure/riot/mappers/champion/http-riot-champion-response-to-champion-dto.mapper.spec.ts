import {
  ChampionDto,
  ChampionInfo,
  ChampionSkin,
  ChampionSpell,
  ChampionStats,
  BasicChampionSpell,
} from '../../../../champions/champion.dto';
import { Image } from '../../../../image.type';
import { HttpRiotChampionResponseToChampionDtoMapper } from './http-riot-champion-response-to-champion-dto.mapper';

describe('HttpRiotChampionResponseToChampionDtoMapper', () => {
  const mockChampion: {
    key: string;
    blurb: string;
    id: string;
    image: Image;
    info: ChampionInfo;
    lore: string;
    name: string;
    partype: string;
    passive: BasicChampionSpell;
    skins: ChampionSkin[];
    stats: ChampionStats;
    tags: string[];
    title: string;
    spells: ChampionSpell[];
  } = {
    key: '123',
    blurb: 'A mighty champion.',
    id: 'MockChampion',
    image: {
      full: 'aatrox.png',
      sprite: 'champion0.png',
      group: 'champion',
      x: 0,
      y: 0,
      w: 48,
      h: 48,
    },
    info: { attack: 8, defense: 4, magic: 3, difficulty: 4 },
    lore: 'MockChampion is a champion...',
    name: 'MockChampion',
    partype: 'Mock Resource',
    passive: {
      name: 'Mock 1',
      description: 'Mock 1 description.',
      image: {
        full: 'mock_passive.png',
        sprite: 'spell0.png',
        group: 'spell',
        x: 0,
        y: 0,
        w: 48,
        h: 48,
      },
    },
    skins: [{ id: '1', num: 0, name: 'Mock Skin 1', chromas: false }],
    stats: {
      mpregenperlevel: 1.0,
      mpregen: 3,
      hp: 100,
      hpperlevel: 100,
      mp: 100,
      mpperlevel: 100,
      movespeed: 100,
      armor: 100,
      armorperlevel: 3.25,
      spellblock: 100,
      spellblockperlevel: 1.25,
      attackrange: 100,
      hpregen: 3,
      hpregerperlevel: 0.25,
      crit: 0,
      critperlevel: 0,
      attackdamage: 60,
      attackdamageperlevel: 5,
      attackspeedperlevel: 2.5,
      attackspeed: 0.651,
    },
    tags: ['MockTag1', 'MockTag2'],
    title: 'the Mock',
    spells: [
      {
        id: 'MockQ',
        name: 'Mock Name',
        description: 'Mock description.',
        image: {
          full: 'mock_passive.png',
          sprite: 'spell0.png',
          group: 'spell',
          x: 0,
          y: 0,
          w: 48,
          h: 48,
        },
      },
    ],
  };

  const mockLanguage = 'en_US';
  const mockVersion = '11.9.1';

  it('should correctly map the champion data to ChampionDto', () => {
    const result: ChampionDto = HttpRiotChampionResponseToChampionDtoMapper.map(
      mockLanguage,
      mockChampion,
      mockVersion,
    );

    expect(result.language).toBe(mockLanguage);
    expect(result.version).toBe(mockVersion);
    expect(result.key).toBe(mockChampion.key);
    expect(result.blurb).toBe(mockChampion.blurb);
    expect(result.id).toBe(mockChampion.id);
    expect(result.image).toEqual(mockChampion.image);
    expect(result.info).toEqual(mockChampion.info);
    expect(result.lore).toBe(JSON.stringify(mockChampion.lore));
    expect(result.name).toBe(mockChampion.name);
    expect(result.partype).toBe(mockChampion.partype);
    expect(result.passive).toEqual(mockChampion.passive);
    expect(result.skins).toEqual(mockChampion.skins);
    expect(result.stats).toEqual(mockChampion.stats);
    expect(result.tags).toEqual(mockChampion.tags);
    expect(result.title).toBe(mockChampion.title);
    expect(result.spells).toEqual(mockChampion.spells);
  });
});
