
import type { CardData } from "../game/types";

import IronKnight from "../assets/cardImages/IronKnight.png";
import ShadowAssasin from "../assets/cardImages/ShadowAssasin.png";
import EmberWraith from "../assets/cardImages/EmberWraith.png";
import SoulFire from "../assets/cardImages/SoulFire.png";
import SoulRupture from "../assets/cardImages/SoulRupture.png";
import SoulMend from "../assets/cardImages/SoulMend.png";
import SoulLantern from "../assets/cardImages/SoulLantern.png";
import CrownofAsh from "../assets/cardImages/CrownofAsh.png";
import MirrorofSouls from "../assets/cardImages/MirrorofSouls.png";
import FlameSoul from "../assets/cardImages/FlameSoul.png";
import ShadowSoul from "../assets/cardImages/ShadowSoul.png";
import IronSoul from "../assets/cardImages/IronSoul.png";

export const cards: CardData[] = [
  {
    id: "iron-knight",
    name: "Iron Knight",
    type: "unit",
    cost: 2,
    attack: 3,
    health: 6,
    description: "A durable warrior.",
    image: IronKnight,
  },
  {
    id: "shadow-assassin",
    name: "Shadow Assassin",
    type: "unit",
    cost: 3,
    attack: 5,
    health: 2,
    description: "A fragile but deadly attacker.",
    soulTrait: "Shadow",
    image: ShadowAssasin,
  },
  {
    id: "ember-wraith",
    name: "Ember Wraith",
    type: "unit",
    cost: 2,
    attack: 3,
    health: 3,
    description: "When sacrificed, deal 1 damage.",
    soulTrait: "Flame",
    image: EmberWraith,
  },
  {
    id: "soulfire",
    name: "Soulfire",
    type: "spell",
    cost: 2,
    description: "Deal 3 damage to the opponent.",
    image: SoulFire,
  },
  {
    id: "soul-rupture",
    name: "Soul Rupture",
    type: "spell",
    cost: 3,
    description: "Deal 5 damage to an enemy unit.",
    image: SoulRupture,
  },
  {
    id: "soul-mend",
    name: "Soul Mend",
    type: "spell",
    cost: 1,
    description: "Draw 1 card.",
    image: SoulMend,
  },
  {
    id: "soul-lantern",
    name: "Soul Lantern",
    type: "relic",
    cost: 2,
    description: "Gain 1 Soul Charge when you sacrifice a card.",
    image: SoulLantern,
  },
  {
    id: "crown-of-ash",
    name: "Crown of Ash",
    type: "relic",
    cost: 3,
    description: "Your Flame effects deal 1 extra damage.",
    image: CrownofAsh,
  },
  {
    id: "mirror-of-souls",
    name: "Mirror of Souls",
    type: "relic",
    cost: 2,
    description: "Draw 1 card on your first inheritance each turn.",
    image: MirrorofSouls,
  },
  {
    id: "flame-soul",
    name: "Flame Soul",
    type: "soul",
    cost: 1,
    soulTrait: "Flame",
    description: "Sacrifice to grant Flame Strike.",
    image: FlameSoul,
  },
  {
    id: "shadow-soul",
    name: "Shadow Soul",
    type: "soul",
    cost: 1,
    soulTrait: "Shadow",
    description: "Sacrifice to grant Shadow Strike.",
    image: ShadowSoul,
  },
  {
    id: "iron-soul",
    name: "Iron Soul",
    type: "soul",
    cost: 1,
    soulTrait: "Iron",
    description: "Sacrifice to grant 2 maximum Health.",
    image: IronSoul,
  },
];
