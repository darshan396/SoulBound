import type { DragEvent } from "react";
import "./BattlefieldCard.css";

export type BattlefieldCardData = {
  id: string;
  name: string;
  image: string;
  cost: number;
  attack?: number;
  health?: number;
  kind?: "unit" | "spell" | "soul";
};

type BattlefieldCardProps = {
  card: BattlefieldCardData;
  selected?: boolean;
  targetable?: boolean;
  disabled?: boolean;
  draggable?: boolean;
  isDragging?: boolean;
  onClick?: () => void;
  onDragStart?: (event: DragEvent<HTMLButtonElement>) => void;
  onDragEnd?: () => void;
  onDragOver?: (event: DragEvent<HTMLButtonElement>) => void;
  onDrop?: (event: DragEvent<HTMLButtonElement>) => void;
};

export default function BattlefieldCard({
  card,
  selected = false,
  targetable = false,
  disabled = false,
  draggable = false,
  isDragging = false,
  onClick,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}: BattlefieldCardProps) {
  return (
    <button
      type="button"
      className={[
        "battlefield-card",
        selected ? "selected" : "",
        targetable ? "targetable" : "",
        disabled ? "disabled" : "",
        draggable ? "can-drag" : "",
        isDragging ? "is-dragging" : "",
      ].filter(Boolean).join(" ")}
      onClick={onClick}
      disabled={disabled}
      draggable={draggable && !disabled}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      aria-pressed={selected}
      aria-label={`${card.name}, cost ${card.cost}${card.attack !== undefined ? `, attack ${card.attack}` : ""}${card.health !== undefined ? `, health ${card.health}` : ""}`}
      title={draggable ? `Drag ${card.name} onto the battlefield` : card.name}
    >
      <div className="battlefield-card-art">
        <img src={card.image} alt={card.name} draggable={false} />
        <span className="battlefield-card-cost">{card.cost}</span>
        {card.attack !== undefined && <span className="battlefield-card-attack">{card.attack}</span>}
        {card.health !== undefined && <span className="battlefield-card-health">{card.health}</span>}
      </div>
      <div className="battlefield-card-name">{card.name}</div>
      {selected && <span className="battlefield-card-status">SELECTED</span>}
      {targetable && <span className="battlefield-card-status target-status">VALID TARGET</span>}
    </button>
  );
}
