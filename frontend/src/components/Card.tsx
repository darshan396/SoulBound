
import type { DragEvent } from "react";
import type { CardData } from "../game/types";
import "./Card.css";

interface CardProps {
  card: CardData;
  selected?: boolean;
  disabled?: boolean;
  draggable?: boolean;
  onClick?: (card: CardData) => void;
  onDragStart?: (card: CardData, event: DragEvent<HTMLButtonElement>) => void;
  onDragEnd?: (card: CardData, event: DragEvent<HTMLButtonElement>) => void;
}

const typeLabels: Record<CardData["type"], string> = {
  unit: "UNIT",
  spell: "SPELL",
  relic: "RELIC",
  soul: "SOUL",
};

export default function Card({
  card,
  selected = false,
  disabled = false,
  draggable = true,
  onClick,
  onDragStart,
  onDragEnd,
}: CardProps) {
  function handleDragStart(event: DragEvent<HTMLButtonElement>) {
    if (disabled) {
      event.preventDefault();
      return;
    }

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("application/x-soulbound-card", card.id);

    onDragStart?.(card, event);
  }

  function handleDragEnd(event: DragEvent<HTMLButtonElement>) {
    onDragEnd?.(card, event);
  }

  return (
    <button
      type="button"
      className={`game-card card-${card.type}${selected ? " selected" : ""}${draggable && !disabled ? " draggable" : ""}`}
      onClick={() => onClick?.(card)}
      draggable={draggable && !disabled}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={`${card.name}, ${typeLabels[card.type]}, cost ${card.cost}`}
      title={card.name}
    >
      <div className="card-ornament" />

      <header className="card-header">
        <span className="card-name">{card.name}</span>
        <span className="card-cost">{card.cost}</span>
      </header>

      <div className="card-art">
        {card.image ? (
          <img
            src={card.image}
            alt={`${card.name} artwork`}
            draggable={false}
            onError={(event) => {
              console.error(
                `Failed to load artwork for "${card.name}":`,
                event.currentTarget.src,
              );

              event.currentTarget.style.display = "none";

              const fallback =
                event.currentTarget.parentElement?.querySelector(
                  ".card-art-fallback",
                );

              if (fallback instanceof HTMLElement) {
                fallback.style.display = "grid";
              }
            }}
          />
        ) : null}

        <div
          className="card-art-fallback"
          style={{ display: card.image ? "none" : "grid" }}
        >
          <span>{card.name}</span>
        </div>
      </div>

      <div className="card-type">
        <span>{typeLabels[card.type]}</span>
      </div>

      <section className="card-description">
        <p>{card.description}</p>

        {card.soulTrait && (
          <span className="card-trait">
            {card.soulTrait} Trait
          </span>
        )}
      </section>

      {card.type === "unit" && (
        <>
          <div className="card-stat attack-stat">
            {card.attack ?? 0}
          </div>

          <div className="card-stat health-stat">
            {card.health ?? 0}
          </div>
        </>
      )}
    </button>
  );
}
