import { useMemo, useState, type DragEvent } from "react";
import "./BattleBoard.css";

import PlayerHUD from "./PlayerHUD";
import BattlefieldCard, { type BattlefieldCardData } from "./BattlefieldCard";

import EmberWraith from "../assets/cardImages/EmberWraith.png";
import ShadowAssassin from "../assets/cardImages/ShadowAssasin.png";
import IronKnight from "../assets/cardImages/IronKnight.png";
import SoulFire from "../assets/cardImages/SoulFire.png";
import SoulRupture from "../assets/cardImages/SoulRupture.png";
import FlameSoul from "../assets/cardImages/FlameSoul.png";
import IronSoul from "../assets/cardImages/IronSoul.png";
import ShadowSoul from "../assets/cardImages/ShadowSoul.png";
import SoulMend from "../assets/cardImages/SoulMend.png";
import SoulLantern from "../assets/cardImages/SoulLantern.png";
import CrownOfAsh from "../assets/cardImages/CrownofAsh.png";
import MirrorOfSouls from "../assets/cardImages/MirrorofSouls.png";

type CardKind = "unit" | "spell" | "relic" | "soul";
type Trait = "Flame" | "Shadow" | "Iron";

type GameCard = Omit<BattlefieldCardData, "kind"> & {
  kind: CardKind;
  description: string;
  trait?: Trait;
};

type UnitOnBoard = GameCard & {
  currentHealth: number;
  maxHealth: number;
  canAttack: boolean;
  hasAttacked: boolean;
  traits: Trait[];
};

const CARD_LIBRARY: GameCard[] = [
  { id: "iron-knight", name: "Iron Knight", image: IronKnight, cost: 2, attack: 3, health: 6, kind: "unit", description: "A durable warrior." },
  { id: "shadow-assassin", name: "Shadow Assassin", image: ShadowAssassin, cost: 3, attack: 5, health: 2, kind: "unit", trait: "Shadow", description: "A fragile but deadly attacker." },
  { id: "ember-wraith", name: "Ember Wraith", image: EmberWraith, cost: 2, attack: 3, health: 3, kind: "unit", trait: "Flame", description: "When sacrificed, deal 1 damage." },
  { id: "soulfire", name: "Soulfire", image: SoulFire, cost: 2, kind: "spell", description: "Deal 3 damage to the enemy hero." },
  { id: "soul-rupture", name: "Soul Rupture", image: SoulRupture, cost: 3, kind: "spell", description: "Deal 5 damage to an enemy unit." },
  { id: "soul-mend", name: "Soul Mend", image: SoulMend, cost: 1, kind: "spell", description: "Draw 1 card." },
  { id: "soul-lantern", name: "Soul Lantern", image: SoulLantern, cost: 2, kind: "relic", description: "Gain 1 Soul Charge when you sacrifice a card." },
  { id: "crown-of-ash", name: "Crown of Ash", image: CrownOfAsh, cost: 3, kind: "relic", description: "Your explicitly tagged Flame damage deals +1." },
  { id: "mirror-of-souls", name: "Mirror of Souls", image: MirrorOfSouls, cost: 2, kind: "relic", description: "Draw 1 card on your first inheritance each turn." },
  { id: "flame-soul", name: "Flame Soul", image: FlameSoul, cost: 1, kind: "soul", trait: "Flame", description: "Inherit Flame Strike." },
  { id: "shadow-soul", name: "Shadow Soul", image: ShadowSoul, cost: 1, kind: "soul", trait: "Shadow", description: "Inherit Shadow Strike." },
  { id: "iron-soul", name: "Iron Soul", image: IronSoul, cost: 1, kind: "soul", trait: "Iron", description: "Grant +2 maximum and current health." },
];

const STARTING_DECK = [
  "iron-knight", "iron-knight", "shadow-assassin", "shadow-assassin",
  "ember-wraith", "ember-wraith", "soulfire", "soulfire",
  "soul-rupture", "soul-rupture", "soul-mend", "soul-mend",
  "soul-lantern", "crown-of-ash", "mirror-of-souls",
  "flame-soul", "flame-soul", "shadow-soul", "iron-soul", "iron-soul",
];

function shuffle<T,>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function makeUnit(card: GameCard, canAttack = false): UnitOnBoard {
  const maxHealth = card.health ?? 1;
  return {
    ...card,
    currentHealth: maxHealth,
    maxHealth,
    canAttack,
    hasAttacked: false,
    traits: card.trait ? [card.trait] : [],
  };
}

function toDisplayCard(unit: UnitOnBoard): BattlefieldCardData {
  return {
    id: unit.id,
    name: unit.name,
    image: unit.image,
    cost: unit.cost,
    attack: unit.attack,
    health: unit.currentHealth,
    kind: unit.kind === "relic" ? undefined : unit.kind,
  };
}

export default function BattleBoard() {
  const initialDeck = useMemo(() => shuffle(STARTING_DECK), []);
  const [deck, setDeck] = useState<string[]>(initialDeck.slice(5));
  const [hand, setHand] = useState<GameCard[]>(() =>
    initialDeck.slice(0, 5).map((id, index) => ({
      ...CARD_LIBRARY.find((card) => card.id === id)!,
      id: `${id}-hand-${index}`,
    }))
  );
  const [discard, setDiscard] = useState<GameCard[]>([]);
  const [playerUnits, setPlayerUnits] = useState<UnitOnBoard[]>([
    makeUnit(CARD_LIBRARY[0], true),
  ]);
  const [enemyUnits, setEnemyUnits] = useState<UnitOnBoard[]>([
    makeUnit(CARD_LIBRARY[2], true),
    makeUnit(CARD_LIBRARY[1], true),
  ]);
  const [playerHealth, setPlayerHealth] = useState(30);
  const [enemyHealth, setEnemyHealth] = useState(30);
  const [maxMana, setMaxMana] = useState(1);
  const [mana, setMana] = useState(1);
  const [turn, setTurn] = useState(1);
  const [activePlayer, setActivePlayer] = useState<"player" | "opponent">("player");
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<"play" | "attack" | "rupture" | "inherit" | null>(null);
  const [logs, setLogs] = useState<string[]>(["Your turn. Play a card or attack with a ready unit."]);
  const [soulCharges, setSoulCharges] = useState(0);
  const [playerRelics, setPlayerRelics] = useState<string[]>([]);
  const [inheritedThisTurn, setInheritedThisTurn] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [activeDropZone, setActiveDropZone] = useState<string | null>(null);

  const selectedHandCard = hand.find((card) => card.id === selectedCardId);
  const selectedUnit = playerUnits.find((unit) => unit.id === selectedCardId);
  const playerHasLantern = playerRelics.includes("soul-lantern");
  const playerHasCrown = playerRelics.includes("crown-of-ash");
  const playerHasMirror = playerRelics.includes("mirror-of-souls");

  function log(message: string) {
    setLogs((current) => [message, ...current].slice(0, 6));
  }

  function drawCard() {
    if (hand.length >= 10) {
      log("Your hand is full. No card was drawn.");
      return;
    }
    if (deck.length === 0) {
      log("Your deck is empty. No card was drawn.");
      return;
    }
    const [nextId, ...remaining] = deck;
    const definition = CARD_LIBRARY.find((card) => card.id === nextId);
    if (!definition) return;
    setDeck(remaining);
    setHand((current) => [...current, { ...definition, id: `${nextId}-draw-${turn}-${current.length}` }]);
    log(`Drew ${definition.name}.`);
  }

  function removeFromHand(card: GameCard) {
    setHand((current) => current.filter((item) => item.id !== card.id));
  }

  function finishGameIfNeeded(nextPlayerHealth: number, nextEnemyHealth: number) {
    if (nextPlayerHealth <= 0 || nextEnemyHealth <= 0) {
      setGameOver(true);
      log(nextEnemyHealth <= 0 ? "Victory! The enemy has fallen." : "Defeat. Your soul has been claimed.");
      return true;
    }
    return false;
  }

  function playCard(card: GameCard, targetUnitId?: string) {
    if (gameOver || activePlayer !== "player") return;
    if (!hand.some((item) => item.id === card.id)) return;
    if (mana < card.cost) {
      log(`Not enough mana to play ${card.name}.`);
      return;
    }
    if (card.kind === "spell" && card.id === "soul-rupture" && !targetUnitId) {
      setSelectedCardId(card.id);
      setPendingAction("rupture");
      log("Choose an enemy unit for Soul Rupture.");
      return;
    }
    if (card.kind === "soul") {
      setSelectedCardId(card.id);
      setPendingAction("inherit");
      log(`Choose a friendly unit to inherit ${card.name}.`);
      return;
    }

    setMana((current) => current - card.cost);
    removeFromHand(card);
    setSelectedCardId(null);
    setPendingAction(null);

    if (card.kind === "unit") {
      setPlayerUnits((current) => [...current, makeUnit(card)]);
      log(`${card.name} enters the battlefield. It cannot attack this turn.`);
      return;
    }

    if (card.kind === "relic") {
      if (playerRelics.includes(card.id)) {
        setMana((current) => current + card.cost);
        setHand((current) => [...current, card]);
        log(`Only one ${card.name} can be active at a time.`);
        return;
      }
      setPlayerRelics((current) => [...current, card.id]);
      log(`${card.name} is now active.`);
      return;
    }

    if (card.id === "soulfire") {
      const damage = 3;
      const nextEnemyHealth = Math.max(0, enemyHealth - damage);
      setEnemyHealth(nextEnemyHealth);
      setDiscard((current) => [...current, card]);
      log(`Soulfire deals ${damage} damage to the enemy hero.`);
      finishGameIfNeeded(playerHealth, nextEnemyHealth);
    } else if (card.id === "soul-rupture" && targetUnitId) {
      resolveRupture(card, targetUnitId);
    } else if (card.id === "soul-mend") {
      setDiscard((current) => [...current, card]);
      drawCard();
      log("Soul Mend resolves.");
    }
  }

  function resolveRupture(card: GameCard, targetUnitId: string) {
    const target = enemyUnits.find((unit) => unit.id === targetUnitId);
    if (!target) {
      log("Soul Rupture needs a valid enemy unit.");
      return;
    }
    const nextHealth = target.currentHealth - 5;
    const survives = nextHealth > 0;
    setEnemyUnits((current) =>
      current.flatMap((unit) =>
        unit.id !== targetUnitId
          ? [unit]
          : survives
            ? [{ ...unit, currentHealth: nextHealth }]
            : []
      )
    );
    setDiscard((current) => [...current, card]);
    log(survives ? `Soul Rupture deals 5 damage to ${target.name}.` : `${target.name} is destroyed by Soul Rupture.`);
    if (!survives) setDiscard((current) => [...current, target]);
  }

  function inheritSoul(soul: GameCard, unitId: string) {
    const target = playerUnits.find((unit) => unit.id === unitId);
    if (!target || !soul.trait) {
      log("That inheritance target is invalid.");
      return;
    }
    if (target.traits.includes(soul.trait)) {
      log(`${target.name} already has the ${soul.trait} trait.`);
      return;
    }
    if (target.traits.length >= 2) {
      log(`${target.name} cannot inherit more than two traits.`);
      return;
    }
    if (mana < soul.cost) {
      log(`Not enough mana to use ${soul.name}.`);
      return;
    }
    setMana((current) => current - soul.cost);
    setPlayerUnits((current) => current.map((unit) => {
      if (unit.id !== unitId) return unit;
      if (soul.trait === "Iron") {
        return { ...unit, traits: [...unit.traits, soul.trait!], maxHealth: unit.maxHealth + 2, currentHealth: unit.currentHealth + 2 };
      }
      return { ...unit, traits: [...unit.traits, soul.trait!] };
    }));
    removeFromHand(soul);
    setDiscard((current) => [...current, soul]);
    setSelectedCardId(null);
    setPendingAction(null);
    log(`${target.name} inherits ${soul.trait}.`);
    if (playerHasMirror && !inheritedThisTurn) {
      setInheritedThisTurn(true);
      drawCard();
      log("Mirror of Souls triggers: draw 1 card.");
    }
  }

  function attack(attackerId: string, targetId?: string) {
    if (gameOver || activePlayer !== "player") return;
    const attacker = playerUnits.find((unit) => unit.id === attackerId);
    if (!attacker || !attacker.canAttack || attacker.hasAttacked) {
      log("That unit cannot attack right now.");
      return;
    }

    if (!targetId) {
      const nextEnemyHealth = Math.max(0, enemyHealth - (attacker.attack ?? 0));
      setEnemyHealth(nextEnemyHealth);
      setPlayerUnits((current) => current.map((unit) => unit.id === attackerId ? { ...unit, hasAttacked: true } : unit));
      log(`${attacker.name} attacks the enemy hero for ${attacker.attack ?? 0}.`);
      finishGameIfNeeded(playerHealth, nextEnemyHealth);
      setSelectedCardId(null);
      setPendingAction(null);
      return;
    }

    const defender = enemyUnits.find((unit) => unit.id === targetId);
    if (!defender) return;
    const attackerHealth = attacker.currentHealth - (defender.attack ?? 0);
    const defenderHealth = defender.currentHealth - (attacker.attack ?? 0);
    setPlayerUnits((current) => current.flatMap((unit) =>
      unit.id !== attackerId ? [unit] :
        attackerHealth > 0 ? [{ ...unit, currentHealth: attackerHealth, hasAttacked: true }] : []
    ));
    setEnemyUnits((current) => current.flatMap((unit) =>
      unit.id !== targetId ? [unit] :
        defenderHealth > 0 ? [{ ...unit, currentHealth: defenderHealth }] : []
    ));
    if (attackerHealth <= 0) setDiscard((current) => [...current, attacker]);
    if (defenderHealth <= 0) setDiscard((current) => [...current, defender]);
    log(`${attacker.name} and ${defender.name} deal damage simultaneously.`);
    if (attackerHealth <= 0) log(`${attacker.name} is destroyed.`);
    if (defenderHealth <= 0) log(`${defender.name} is destroyed.`);
    setSelectedCardId(null);
    setPendingAction(null);
  }

  function sacrificeUnit(unitId: string) {
    if (gameOver || activePlayer !== "player") return;
    const unit = playerUnits.find((item) => item.id === unitId);
    if (!unit) return;
    setPlayerUnits((current) => current.filter((item) => item.id !== unitId));
    setDiscard((current) => [...current, unit]);
    if (playerHasLantern) {
      setSoulCharges((current) => current + 1);
      log(`Soul Lantern grants 1 Soul Charge for sacrificing ${unit.name}.`);
    } else {
      log(`${unit.name} is sacrificed.`);
    }
    if (unit.id === "ember-wraith") {
      const damage = playerHasCrown ? 2 : 1;
      const nextEnemyHealth = Math.max(0, enemyHealth - damage);
      setEnemyHealth(nextEnemyHealth);
      log(`Ember Wraith's Flame sacrifice effect deals ${damage} damage.`);
      finishGameIfNeeded(playerHealth, nextEnemyHealth);
    }
    setSelectedCardId(null);
  }

  function endTurn() {
    if (gameOver) return;
    setSelectedCardId(null);
    setPendingAction(null);

    if (activePlayer === "player") {
      setActivePlayer("opponent");
      log("Opponent's turn.");
      // Simple local opponent: ready units attack the player's hero.
      let damage = 0;
      enemyUnits.forEach((unit) => {
        if (unit.canAttack && !unit.hasAttacked) damage += unit.attack ?? 0;
      });
      if (damage > 0) {
        const nextHealth = Math.max(0, playerHealth - damage);
        setPlayerHealth(nextHealth);
        setEnemyUnits((current) => current.map((unit) => ({ ...unit, hasAttacked: true })));
        log(`Enemy units deal ${damage} damage to you.`);
        if (finishGameIfNeeded(nextHealth, enemyHealth)) return;
      }
      setTurn((current) => current + 1);
      setActivePlayer("player");
      setMaxMana((current) => Math.min(10, current + 1));
      setMana(Math.min(10, maxMana + 1));
      setPlayerUnits((current) => current.map((unit) => ({ ...unit, canAttack: true, hasAttacked: false })));
      setEnemyUnits((current) => current.map((unit) => ({ ...unit, canAttack: true, hasAttacked: false })));
      setInheritedThisTurn(false);
      drawCard();
      log(`Turn ${turn + 1} begins. Mana refreshed.`);
    }
  }

  function onHandDragStart(card: GameCard, event: DragEvent<HTMLButtonElement>) {
    setDraggedCardId(card.id);
    event.dataTransfer.setData("text/plain", card.id);
    event.dataTransfer.effectAllowed = "move";
  }

  function onHandDragEnd() {
    setDraggedCardId(null);
    setActiveDropZone(null);
  }

  function allowDrop(event: DragEvent<HTMLElement>, zone: string) {
    if (!draggedCardId) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setActiveDropZone(zone);
  }

  function dropCard(event: DragEvent<HTMLElement>, zone: "units" | "hero" | "enemy") {
    event.preventDefault();
    const cardId = event.dataTransfer.getData("text/plain") || draggedCardId;
    const card = hand.find((item) => item.id === cardId);
    setDraggedCardId(null);
    setActiveDropZone(null);
    if (!card) return;
    if (zone === "units" && card.kind === "unit") playCard(card);
    else if (zone === "hero" && card.id === "soulfire") playCard(card);
    else if (zone === "enemy" && card.id === "soul-rupture") {
      setSelectedCardId(card.id);
      setPendingAction("rupture");
      log("Choose an enemy unit for Soul Rupture.");
    } else {
      log("That card cannot be played in that zone.");
    }
  }

  function handleHandCardClick(card: GameCard) {
    if (pendingAction === "rupture" && card.id === selectedCardId) return;
    if (selectedUnit && pendingAction === "attack") {
      setPendingAction(null);
      setSelectedCardId(null);
      return;
    }
    if (selectedCardId === card.id) {
      setSelectedCardId(null);
      setPendingAction(null);
      return;
    }
    if (card.kind === "spell" && card.id === "soul-rupture") {
      setSelectedCardId(card.id);
      setPendingAction("rupture");
      log("Choose an enemy unit for Soul Rupture.");
      return;
    }
    if (card.kind === "soul") {
      setSelectedCardId(card.id);
      setPendingAction("inherit");
      log(`Choose a friendly unit for ${card.name}.`);
      return;
    }
    playCard(card);
  }

  function handleFriendlyUnitClick(unit: UnitOnBoard) {
    if (pendingAction === "inherit" && selectedHandCard?.kind === "soul") {
      inheritSoul(selectedHandCard, unit.id);
      return;
    }
    if (pendingAction === "attack" && selectedUnit) {
      attack(selectedUnit.id);
      return;
    }
    setSelectedCardId(unit.id);
    setPendingAction("attack");
    log(unit.hasAttacked ? `${unit.name} has already attacked.` : unit.canAttack ? `${unit.name} selected. Click an enemy unit to attack, or click it again to attack the hero.` : `${unit.name} cannot attack on the turn it entered play.`);
  }

  function handleEnemyUnitClick(unit: UnitOnBoard) {
    if (pendingAction === "rupture" && selectedHandCard) {
      const spell = selectedHandCard;
      if (mana < spell.cost) {
        log("Not enough mana for Soul Rupture.");
        return;
      }
      setMana((current) => current - spell.cost);
      removeFromHand(spell);
      setSelectedCardId(null);
      setPendingAction(null);
      resolveRupture(spell, unit.id);
      return;
    }
    if (pendingAction === "attack" && selectedUnit) {
      attack(selectedUnit.id, unit.id);
    }
  }

  function handleHeroTarget() {
    if (pendingAction === "attack" && selectedUnit) {
      attack(selectedUnit.id);
      return;
    }
    if (selectedHandCard?.id === "soulfire") {
      playCard(selectedHandCard);
    }
  }

  return (
    <main className="battle-board">
      <div className="arena-overlay" />

      <header className="opponent-area">
        <PlayerHUD name="Malakor the Undying" health={enemyHealth} mana={Math.min(10, turn)} maxMana={Math.min(10, turn)} opponent />
        <div className="opponent-hand">
          {[0, 1, 2, 3, 4].map((card) => <div className="card-back" key={card}><span>✦</span></div>)}
        </div>
        <div className="opponent-row enemy-unit-drop-target drop-zone">
          {enemyUnits.map((unit) => (
            <BattlefieldCard
              key={unit.id}
              card={toDisplayCard(unit)}
              selected={selectedCardId === unit.id}
              targetable={pendingAction === "attack" || pendingAction === "rupture"}
              onClick={() => handleEnemyUnitClick(unit)}
            />
          ))}
          <button type="button" className="enemy-hero-drop-target" onClick={handleHeroTarget} onDragOver={(event) => allowDrop(event, "hero")} onDrop={(event) => dropCard(event, "hero")}>
            Enemy Hero · {enemyHealth} HP
          </button>
        </div>
      </header>

      <section className="battle-divider"><span>ᚱ · ᚷ · ᛟ · ᚦ · ᛉ · ᚱ</span></section>

      <section className={`player-unit-row drop-zone ${activeDropZone === "units" ? "drag-over" : ""}`} onDragOver={(event) => allowDrop(event, "units")} onDragLeave={() => setActiveDropZone(null)} onDrop={(event) => dropCard(event, "units")}>
        {playerUnits.map((unit) => (
          <div className="friendly-unit-wrap" key={unit.id}>
            <BattlefieldCard
              card={toDisplayCard(unit)}
              selected={selectedCardId === unit.id}
              onClick={() => handleFriendlyUnitClick(unit)}
            />
            <button type="button" className="sacrifice-unit" onClick={() => sacrificeUnit(unit.id)} disabled={gameOver} title={`Sacrifice ${unit.name}`}>Sacrifice</button>
          </div>
        ))}
        {playerUnits.length === 0 && <span className="drop-hint">Drag a unit here to summon it</span>}
      </section>

      <aside className="combat-log" aria-label="Combat log">
        {logs.map((entry, index) => <p key={`${entry}-${index}`}>{entry}</p>)}
      </aside>

      <aside className="turn-controls">
        <button type="button" className="soul-orb" aria-label="Soul Charges" title={`${soulCharges} Soul Charges`}>{soulCharges}</button>
        <button type="button" className="end-turn" onClick={endTurn} disabled={gameOver || activePlayer !== "player"}>END<br />TURN</button>
        <div className="turn-counter">{turn}</div>
      </aside>

      <footer className="player-area">
        <div className="player-bottom-hud">
          <PlayerHUD name="Aethelgard, Soul Keeper" health={playerHealth} mana={mana} maxMana={maxMana} />
        </div>

        <div className="player-relic">
          {playerRelics.length === 0 ? <small>No active relics</small> : playerRelics.map((id) => <small key={id}>{CARD_LIBRARY.find((card) => card.id === id)?.name}</small>)}
        </div>

        <div className="player-hand">
          {hand.map((card) => (
            <BattlefieldCard
              key={card.id}
              card={card}
              selected={selectedCardId === card.id}
              disabled={gameOver || activePlayer !== "player"}
              draggable
              isDragging={draggedCardId === card.id}
              onClick={() => handleHandCardClick(card)}
              onDragStart={(event) => onHandDragStart(card, event)}
              onDragEnd={onHandDragEnd}
            />
          ))}
          {hand.length === 0 && <span className="empty-hand">Your hand is empty</span>}
        </div>

        <div className="deck-area">
          <div><span>Deck</span><strong>{deck.length}</strong></div>
          <div><span>Discard</span><strong>{discard.length}</strong></div>
        </div>
      </footer>

      {gameOver && (
        <div className="game-over-overlay" role="dialog" aria-modal="true">
          <div className="game-over-panel">
            <h2>{enemyHealth <= 0 ? "Victory" : "Defeat"}</h2>
            <p>{enemyHealth <= 0 ? "Malakor has been defeated." : "Your soul has been claimed."}</p>
            <button type="button" onClick={() => window.location.reload()}>Play Again</button>
          </div>
        </div>
      )}
    </main>
  );
}
