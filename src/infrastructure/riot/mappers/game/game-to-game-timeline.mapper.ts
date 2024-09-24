import { Injectable } from '@nestjs/common';
import {
  GameTimelineDto,
  ParticipantTimelineDto,
} from '../../../../games/dto/timeline/game-timeline.dto';
import { ItemOnTimelineDto } from 'src/games/dto/timeline/item-on-timeline.dto';
import { SkillOnTimeLineDto } from 'src/games/dto/timeline/skill-on-timeline.dto';

@Injectable()
export class GameToGameTimelineMapper {
  public static map(game: any): GameTimelineDto {
    const gameTimeline: GameTimelineDto = {
      participantsTimelines: Array.from(
        { length: 11 },
        (_, index) =>
          ({
            participantId: index + 1,
            itemsTimeline: [],
            skillsTimeline: [],
          }) as ParticipantTimelineDto,
      ),
    };

    game.info.frames.map((frame) => {
      frame.events.map((event) => {
        if (
          event.itemId &&
          event.participantId &&
          (event.type === 'ITEM_PURCHASED' ||
            event.type === 'ITEM_SOLD' ||
            event.type === 'ITEM_UNDO')
        ) {
          const participantIndex = event.participantId - 1;
          gameTimeline.participantsTimelines[
            participantIndex
          ].itemsTimeline.push({
            itemId: event.itemId,
            timestamp: event.timestamp,
            type: event.type,
          } as ItemOnTimelineDto);
        }
        if (event.participantId && event.type === 'SKILL_LEVEL_UP') {
          const participantIndex = event.participantId - 1;
          gameTimeline.participantsTimelines[
            participantIndex
          ].skillsTimeline.push({
            skillSlot: event.skillSlot,
            timestamp: event.timestamp,
            type: event.type,
          } as SkillOnTimeLineDto);
        }
      });
    });
    return gameTimeline;
  }
}
