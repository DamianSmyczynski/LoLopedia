import { ItemOnTimelineDto } from './item-on-timeline.dto';
import { SkillOnTimeLineDto } from './skill-on-timeline.dto';

export type GameTimelineDto = {
  participantsTimelines: ParticipantTimelineDto[];
};

export type ParticipantTimelineDto = {
  participantId: number;
  itemsTimeline: ItemOnTimelineDto[];
  skillsTimeline: SkillOnTimeLineDto[];
};
