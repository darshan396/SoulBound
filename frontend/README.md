# Soulbound

A dark-fantasy card game concept built around souls, sacrifice, and strategic decisions.

## About

Soulbound is a card game where every card has a purpose. Players use units, spells, relics, and soul cards to outsmart their opponents and reduce their life points to zero.

This repository currently contains a **reusable React card component** for displaying game cards.

## Features

- Reusable card component built with React and TypeScript
- Four card types: Units, Spells, Relics, and Souls
- Customizable card names, costs, descriptions, and artwork
- Attack and health stats for unit cards
- Dark-fantasy themed styling with CSS

## Tech Stack

- React
- TypeScript
- CSS
- Vite

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd soulbound
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open the local URL displayed in your terminal.

## Usage

Import and use the reusable `Card` component:

```tsx
import Card from "./Card";

<Card
  name="Iron Knight"
  type="Unit"
  cost={2}
  attack={3}
  health={6}
  description="A warrior bound by an ancient soul."
/>
```

## Project Status

**In Development** — Currently focused on the card UI. Gameplay mechanics and other features may be added later.

## License

No license has been specified yet.
