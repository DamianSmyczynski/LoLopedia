import { PerkStyleSelectionDto } from './perk-style-selection.dto';

export type PerkStyleDto = {
  description: string;
  selections: PerkStyleSelectionDto[];
  style: number;
};
