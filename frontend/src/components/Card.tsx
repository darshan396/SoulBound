
import type { CardData } from "../game/types";
import "./Card.css";

interface CardProps {
  card: CardData;
  selected?: boolean;
  disabled?: boolean;
  onClick?: (card: CardData) => void;
}

export default function Card({
  card,
  selected = false,
  disabled = false,
  onClick,
}: CardProps) {
  const typeLabels = {
    unit: "UNIT",
    spell: "SPELL",
    relic: "RELIC",
    soul: "SOUL",
  };

  return (
    <button
      type="button"
      className={`game-card card-${card.type} ${
        selected ? "selected" : ""
      }`}
      onClick={() => onClick?.(card)}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={`${card.name}, ${typeLabels[card.type]}, ${card.cost} energy`}
    >
      <header className="card-header">
        <span className="card-name">{card.name}</span>
        <span className="card-cost">{card.cost}</span>
      </header>

      <div className="card-image">
        {card.image ? (
          <img src={card.image} alt={card.name} />
        ) : (
          <div className="card-image-placeholder">
            {card.name.slice(0, 1)}
          </div>
        )}
      </div>

      <span className="card-type">
        {typeLabels[card.type]}
      </span>

      <div className="card-description">
        {card.description}
      </div>

      {card.soulTrait && (
        <div className="card-trait">
          Trait: {card.soulTrait}
        </div>
      )}

      {card.type === "unit" && (
        <footer className="card-stats">
          <span>ATK {card.attack ?? 0}</span>
          <span>HP {card.health ?? 0}</span>
        </footer>
      )}
    </button>
  );
}
