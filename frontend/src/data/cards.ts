import type { CardData } from "../game/types";

import CrownOfAsh from "../assets/cardImages/CrownofAsh.png";
import EmberWraith from "../assets/cardImages/EmberWraith.png";
import FlameSoul from "../assets/cardImages/FlameSoul.png";
import IronKnight from "../assets/cardImages/IronKnight.png";
import IronSoul from "../assets/cardImages/IronSoul.png";
import MirrorOfSouls from "../assets/cardImages/MirrorofSouls.png";
import ShadowAssassin from "../assets/cardImages/ShadowAssasin.png";
import ShadowSoul from "../assets/cardImages/ShadowSoul.png";
import SoulFire from "../assets/cardImages/SoulFire.png";
import SoulLantern from "../assets/cardImages/SoulLantern.png";
import SoulMend from "../assets/cardImages/SoulMend.png";
import SoulRupture from "../assets/cardImages/SoulRupture.png";

export const cards: CardData[] = [
  {
    id: "iron-knight",
    name: "Iron Knight",
    type: "unit",
    cost: 3,
    attack: 3,
    health: 6,
    image: IronKnight,
    description:
      "A steadfast warrior bound by an ancient oath. Hold the line against the enemy.",
    soulTrait: "Iron Will",
  },
  {
    id: "shadow-assassin",
    name: "Shadow Assassin",
    type: "unit",
    cost: 2,
    attack: 5,
    health: 2,
    image: ShadowAssassin,
    description:
      "A silent killer who strikes from the darkness before the enemy can react.",
    soulTrait: "Shadow Strike",
  },
  {
    id: "ember-wraith",
    name: "Ember Wraith",
    type: "unit",
    cost: 2,
    attack: 3,
    health: 3,
    image: EmberWraith,
    description:
      "A restless spirit carrying the last embers of a forgotten battlefield.",
    soulTrait: "Emberborn",
  },
  {
    id: "soul-fire",
    name: "Soulfire",
    type: "spell",
    cost: 2,
    image: SoulFire,
    description:
      "Deal 3 damage to the enemy hero.",
  },
  {
    id: "soul-rupture",
    name: "Soul Rupture",
    type: "spell",
    cost: 3,
    image: SoulRupture,
    description:
      "Deal 5 damage to an enemy unit.",
  },
  {
    id: "soul-mend",
    name: "Soul Mend",
    type: "spell",
    cost: 1,
    image: SoulMend,
    description:
      "Draw 1 card from your deck.",
  },
  {
    id: "crown-of-ash",
    name: "Crown of Ash",
    type: "relic",
    cost: 3,
    image: CrownOfAsh,
    description:
      "Increase damage dealt by qualifying Flame effects by 1.",
    soulTrait: "Ashen Dominion",
  },
  {
    id: "mirror-of-souls",
    name: "Mirror of Souls",
    type: "relic",
    cost: 2,
    image: MirrorOfSouls,
    description:
      "Draw 1 card on the first successful inheritance each turn.",
    soulTrait: "Soul Reflection",
  },
  {
    id: "soul-lantern",
    name: "Soul Lantern",
    type: "relic",
    cost: 2,
    image: SoulLantern,
    description:
      "Gain 1 Soul Charge for each valid sacrifice.",
    soulTrait: "Soul Harvest",
  },
  {
    id: "flame-soul",
    name: "Flame Soul",
    type: "soul",
    cost: 2,
    image: FlameSoul,
    description:
      "A burning spirit whose power is waiting to be inherited.",
    soulTrait: "Flame",
  },
  {
    id: "iron-soul",
    name: "Iron Soul",
    type: "soul",
    cost: 2,
    image: IronSoul,
    description:
      "An unyielding spirit carrying the resilience of ancient steel.",
    soulTrait: "Fortitude",
  },
  {
    id: "shadow-soul",
    name: "Shadow Soul",
    type: "soul",
    cost: 2,
    image: ShadowSoul,
    description:
      "A concealed spirit that embodies the secrets of the void.",
    soulTrait: "Shadow",
  },
];

export function getCardById(id: string): CardData | undefined {
  return cards.find((card) => card.id === id);
}

export function getCardsByType(
  type: CardData["type"],
): CardData[] {
  return cards.filter((card) => card.type === type);
}
