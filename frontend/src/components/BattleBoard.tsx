import { useState, type DragEvent } from "react";
import "./BattleBoard.css";

import PlayerHUD from "./PlayerHUD";
import BattlefieldCard, { type BattlefieldCardData } from "./BattlefieldCard";

import EmberWraith from "../assets/cardImages/EmberWraith.png";
import ShadowAssassin from "../assets/cardImages/ShadowAssasin.png";
import IronKnight from "../assets/cardImages/IronKnight.png";
import SoulFire from "../assets/cardImages/SoulFire.png";
import SoulRupture from "../assets/cardImages/SoulRupture.png";
import FlameSoul from "../assets/cardImages/FlameSoul.png";

type CardKind = "unit" | "spell" | "soul";

type BattleCard = BattlefieldCardData & {
  kind: CardKind;
};

const initialOpponentUnits: BattleCard[] = [
  { id: "ember-wraith", name: "Ember Wraith", image: EmberWraith, cost: 2, attack: 3, health: 3, kind: "unit" },
  { id: "shadow-assassin", name: "Shadow Assassin", image: ShadowAssassin, cost: 2, attack: 5, health: 2, kind: "unit" },
];

const initialPlayerUnits: BattleCard[] = [
  { id: "iron-knight", name: "Iron Knight", image: IronKnight, cost: 3, attack: 3, health: 6, kind: "unit" },
  { id: "player-assassin", name: "Shadow Assassin", image: ShadowAssassin, cost: 3, attack: 5, health: 2, kind: "unit" },
];

const initialHand: BattleCard[] = [
  { id: "soulfire", name: "Soulfire", image: SoulFire, cost: 2, kind: "spell" },
  { id: "soul-rupture", name: "Soul Rupture", image: SoulRupture, cost: 3, kind: "spell" },
  { id: "ember-hand", name: "Ember Wraith", image: EmberWraith, cost: 2, attack: 3, health: 3, kind: "unit" },
  { id: "flame-soul", name: "Flame Soul", image: FlameSoul, cost: 2, kind: "soul" },
];

export default function BattleBoard() {
  const [health, setHealth] = useState(30);
  const [enemyHealth, setEnemyHealth] = useState(30);
  const [mana, setMana] = useState(8);
  const [maxMana, setMaxMana] = useState(8);
  const [playerUnits, setPlayerUnits] = useState<BattleCard[]>(initialPlayerUnits);
  const [opponentUnits, setOpponentUnits] = useState<BattleCard[]>(initialOpponentUnits);
  const [handCards, setHandCards] = useState<BattleCard[]>(initialHand);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [activeDropZone, setActiveDropZone] = useState<"player" | "opponent" | null>(null);
  const [turn, setTurn] = useState(1);
  const [logs, setLogs] = useState<string[]>([
    "Drag a card from your hand onto the battlefield.",
    "Units can be summoned to your side.",
    "Soulfire and Soul Rupture can target the enemy side.",
  ]);

  function addLog(message: string) {
    setLogs((current) => [message, ...current].slice(0, 5));
  }

  function handleDragStart(event: DragEvent<HTMLButtonElement>, cardId: string) {
    setDraggedCardId(cardId);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", cardId);
  }

  function handleDragEnd() {
    setDraggedCardId(null);
    setActiveDropZone(null);
  }

  function allowDrop(event: DragEvent<HTMLElement>, zone: "player" | "opponent") {
    if (!draggedCardId) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setActiveDropZone(zone);
  }

  function playCard(cardId: string, zone: "player" | "opponent", targetUnitId?: string) {
    const card = handCards.find((item) => item.id === cardId);
    if (!card) return;

    if (card.cost > mana) {
      addLog(`Not enough mana to play ${card.name}.`);
      setDraggedCardId(null);
      setActiveDropZone(null);
      return;
    }

    if (card.kind === "unit") {
      if (zone !== "player") {
        addLog("Units must be summoned to your side.");
        setDraggedCardId(null);
        setActiveDropZone(null);
        return;
      }

      setPlayerUnits((current) => [...current, { ...card, id: `${card.id}-${turn}-${current.length}` }]);
      setMana((current) => current - card.cost);
      setHandCards((current) => current.filter((item) => item.id !== cardId));
      addLog(`${card.name} was summoned.`);
    } else if (card.id === "soulfire") {
      if (zone !== "opponent") {
        addLog("Drop Soulfire on the enemy side to deal 3 damage.");
        setDraggedCardId(null);
        setActiveDropZone(null);
        return;
      }

      setEnemyHealth((current) => Math.max(0, current - 3));
      setMana((current) => current - card.cost);
      setHandCards((current) => current.filter((item) => item.id !== cardId));
      addLog("Soulfire deals 3 damage to the enemy.");
    } else if (card.id === "soul-rupture") {
      if (zone !== "opponent" || !targetUnitId) {
        addLog("Drop Soul Rupture directly onto an enemy unit.");
        setDraggedCardId(null);
        setActiveDropZone(null);
        return;
      }

      const target = opponentUnits.find((unit) => unit.id === targetUnitId);
      if (!target) return;
      const remainingHealth = (target.health ?? 0) - 5;
      setOpponentUnits((current) =>
        current
          .map((unit) => unit.id === targetUnitId ? { ...unit, health: remainingHealth } : unit)
          .filter((unit) => (unit.health ?? 0) > 0)
      );
      setMana((current) => current - card.cost);
      setHandCards((current) => current.filter((item) => item.id !== cardId));
      addLog(remainingHealth <= 0 ? `${target.name} was destroyed by Soul Rupture.` : `Soul Rupture deals 5 damage to ${target.name}.`);
    } else {
      setMana((current) => current - card.cost);
      setHandCards((current) => current.filter((item) => item.id !== cardId));
      addLog(`${card.name} was played. Its soul effect is a visual prototype.`);
    }

    setSelectedCard(null);
    setDraggedCardId(null);
    setActiveDropZone(null);
  }

  function handleDrop(event: DragEvent<HTMLElement>, zone: "player" | "opponent", targetUnitId?: string) {
    event.preventDefault();
    event.stopPropagation();
    const cardId = event.dataTransfer.getData("text/plain") || draggedCardId;
    if (cardId) playCard(cardId, zone, targetUnitId);
    setActiveDropZone(null);
  }

  function endTurn() {
    const nextTurn = turn + 1;
    setTurn(nextTurn);
    setMaxMana((current) => Math.min(8, current + 1));
    setMana(Math.min(8, maxMana + 1));
    addLog(`Turn ${nextTurn} begins.`);
    setSelectedCard(null);
  }

  return (
    <main className="battle-board">
      <div className="arena-overlay" />

      <header className="opponent-area">
        <PlayerHUD name="Malakor the Undying" health={enemyHealth} mana={8} opponent />

        <div className="opponent-hand" aria-label="Opponent's hidden hand">
          {[0, 1, 2, 3, 4].map((card) => (
            <div className="card-back" key={card}><span>✦</span></div>
          ))}
        </div>

        <div
          className={`opponent-row drop-zone ${activeDropZone === "opponent" ? "drop-zone-active" : ""}`}
          onDragOver={(event) => allowDrop(event, "opponent")}
          onDragLeave={() => setActiveDropZone(null)}
          onDrop={(event) => handleDrop(event, "opponent")}
          aria-label="Enemy battlefield drop zone"
        >
          {opponentUnits.map((card) => (
            <BattlefieldCard
              key={card.id}
              card={card}
              selected={selectedCard === card.id}
              onClick={() => setSelectedCard((current) => current === card.id ? null : card.id)}
              onDragOver={(event) => allowDrop(event, "opponent")}
              onDrop={(event) => handleDrop(event, "opponent", card.id)}
            />
          ))}
          <div className="relic-tile"><span>♛</span><small>Crown of Ash</small></div>
        </div>
      </header>

      <section className="battle-divider"><span>ᚱ · ᚷ · ᛟ · ᚦ · ᛉ · ᚱ</span></section>

      <section
        className={`player-unit-row drop-zone ${activeDropZone === "player" ? "drop-zone-active" : ""}`}
        onDragOver={(event) => allowDrop(event, "player")}
        onDragLeave={() => setActiveDropZone(null)}
        onDrop={(event) => handleDrop(event, "player")}
        aria-label="Your battlefield. Drop unit cards here."
      >
        {playerUnits.map((card) => (
          <BattlefieldCard
            key={card.id}
            card={card}
            selected={selectedCard === card.id}
            onClick={() => setSelectedCard((current) => current === card.id ? null : card.id)}
          />
        ))}
        {playerUnits.length === 0 && <span className="drop-hint">Drop unit cards here</span>}
      </section>

      <aside className="combat-log" aria-label="Combat log">
        {logs.map((log, index) => <p key={`${log}-${index}`}>{log}</p>)}
      </aside>

      <aside className="turn-controls">
        <button type="button" className="soul-orb" aria-label="Soul energy" title="Soul energy">ϟ</button>
        <button type="button" className="end-turn" onClick={endTurn}>END<br />TURN</button>
        <div className="turn-counter">{turn}</div>
      </aside>

      <footer className="player-area">
        <div className="player-bottom-hud">
          <PlayerHUD name="Aethelgard, Soul Keeper" health={health} mana={mana} />
          <button type="button" className="demo-damage" onClick={() => setHealth((current) => Math.max(0, current - 1))} title="Demo: lose one health">−1 HP</button>
        </div>

        <div className="player-relic"><span>♜</span><small>Soul Lantern</small></div>

        <div className="player-hand" aria-label="Your hand">
          {handCards.map((card) => (
            <BattlefieldCard
              key={card.id}
              card={card}
              selected={selectedCard === card.id}
              draggable
              isDragging={draggedCardId === card.id}
              onClick={() => setSelectedCard((current) => current === card.id ? null : card.id)}
              onDragStart={(event) => handleDragStart(event, card.id)}
              onDragEnd={handleDragEnd}
            />
          ))}
          {handCards.length === 0 && <span className="empty-hand">No cards remaining in hand</span>}
        </div>

        <div className="deck-area">
          <div><span>Deck</span><strong>24</strong></div>
          <div><span>Discard</span><strong>3</strong></div>
        </div>
      </footer>
    </main>
  );
}
