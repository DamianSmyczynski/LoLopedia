import { InfoDto } from './info.dto';
import { MetadataDto } from './metadata.dto';

export type MatchDto = {
  metadata: MetadataDto;
  info: InfoDto;
};
