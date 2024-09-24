import { TeamDto } from 'src/games/dto/riot-http-game/team.dto';

export const blueTeamMock: Partial<TeamDto> = {
  teamId: 100,
  objectives: {
    baron: { first: true, kills: 1 },
    champion: { first: false, kills: 10 },
    dragon: { first: false, kills: 2 },
    horde: { first: true, kills: 6 },
    inhibitor: { first: false, kills: 1 },
    riftHerald: { first: true, kills: 1 },
    tower: { first: true, kills: 3 },
  },
};
export const redTeamMock: Partial<TeamDto> = {
  teamId: 200,
  objectives: {
    baron: { first: false, kills: 0 },
    champion: { first: true, kills: 8 },
    dragon: { first: true, kills: 3 },
    horde: { first: false, kills: 0 },
    inhibitor: { first: true, kills: 0 },
    riftHerald: { first: false, kills: 0 },
    tower: { first: false, kills: 2 },
  },
};
