import { PerkStatsDto } from './perk-stats.dto';
import { PerkStyleDto } from './perk-style.dto';

export type PerksDto = {
  statPerks: PerkStatsDto;
  styles: PerkStyleDto[];
};
