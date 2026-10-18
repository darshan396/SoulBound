
export type CardType = "unit" | "spell" | "relic" | "soul";

export interface CardData {
  id: string;
  name: string;
  type: CardType;
  cost: number;
  description: string;
  image?: string;
  attack?: number;
  health?: number;
  soulTrait?: string;
}
