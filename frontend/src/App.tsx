import { useState } from "react";
import Card from "./components/Card";
import { cards } from "./data/cards";
import type { CardData } from "./game/types";
import "./App.css";

export default function App() {
  const [selectedCard, setSelectedCard] =
    useState<string | null>(null);

  function handleSelect(card: CardData) {
    setSelectedCard((current) =>
      current === card.id ? null : card.id
    );
  }

  return (
    <main className="game">
      <h1>SOULBOUND</h1>
      <p>Choose a card to inspect it.</p>

      <section className="card-grid">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            selected={selectedCard === card.id}
            onClick={handleSelect}
          />
        ))}
      </section>

      {selectedCard && (
        <p className="selected-card">
          Selected:{" "}
          {cards.find((card) => card.id === selectedCard)?.name}
        </p>
      )}
    </main>
  );
}