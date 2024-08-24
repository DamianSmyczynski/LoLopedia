import { InfoDto } from './info.dto';
import { MetadataDto } from './metadata.dto';

export type GameDto = {
  metadata: MetadataDto;
  info: InfoDto;
};
