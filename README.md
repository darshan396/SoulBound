# Soulbound

A dark-fantasy strategy card game built around **souls, sacrifice, and strategic decisions**.

## About

Soulbound is a dark-fantasy card game concept in which players use Units, Spells, Relics, and Souls to outsmart their opponents. The project aims to combine a reusable card interface with a modular backend architecture that can support future gameplay systems.

The repository currently contains a React and TypeScript frontend and a Node.js and Express backend. Development is focused on the card UI, backend API foundations, and organizing server-side routes.

## Features

### Frontend
- Reusable card component built with React and TypeScript.
- Four card types: Units, Spells, Relics, and Souls.
- Configurable card names, costs, descriptions, and artwork.
- Attack and health statistics for unit cards.
- Soul traits such as Flame, Shadow, and Iron.
- Interactive card selection.
- Dark-fantasy styling with medieval-inspired typography.
- Centralized card data and TypeScript type definitions.
- Collection of 12 predefined cards.

### Backend
- **Node.js and Express** backend.
- JavaScript ES modules.
- Express 5.x application setup.
- CORS middleware configured.
- Nodemon for development.
- Dedicated server entry point at `backend/src/server.js`.
- Server configured to run on port `5050`.
- Health-check endpoint: `GET /api/health`.
- Modular route structure for authentication, users, games, custom games, and rules.
- Routers mounted under dedicated API prefixes.
- Initial placeholder authentication handlers and demonstration game-route handlers.

> Authentication, database persistence, and complete gameplay logic are not yet implemented. The route structure provides a foundation for future development.

## Tech Stack

### Frontend
- React
- TypeScript
- CSS
- Vite

### Backend
- Node.js
- Express 5.x
- JavaScript ES modules
- CORS
- Nodemon

### Database
Database integration is not currently implemented. MongoDB was considered as a possible future option, but it should not be treated as an existing dependency.

## Project Structure

```text
soulbound/
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   │   └── cardImages/
│   │   ├── components/
│   │   │   ├── Card.tsx
│   │   │   └── Card.css
│   │   ├── data/
│   │   │   └── cards.ts
│   │   ├── game/
│   │   │   └── types.ts
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   └── src/
│       ├── server.js
│       └── routes/
│           ├── auth.routes.js
│           ├── user.routes.js
│           ├── game.routes.js
│           ├── customGame.routes.js
│           └── rules.routes.js
│
└── README.md
```

*The structure above reflects the known entry point and route organization. Additional files may exist in the repository.*

## Backend API

The backend is organized around the following API prefixes.

| Prefix | Purpose | Current status |
|---|---|---|
| `/api/health` | Check whether the backend is responding | Implemented |
| `/api/auth` | Authentication-related endpoints | Placeholder handlers |
| `/api/user` | User-related endpoints | Route structure created |
| `/api/games` | Game-related endpoints | Demonstration handlers |
| `/api/rooms` | Custom-game endpoints | Route structure created |
| `/api/rules` | Game-rules endpoints | Route structure created |

The route prefixes establish an initial separation of responsibilities. They do not imply that user management, authentication, persistent games, or complete rule enforcement are operational.

### Health Check

**Endpoint:** `GET /api/health`

This endpoint is available for checking whether the backend server is responding.

Example request:

```bash
curl http://localhost:5050/api/health
```

Use the response returned by the running server to verify its current status.

## Getting Started

### Prerequisites

- Node.js and npm.
- Git.

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd soulbound
```

Replace the placeholder with your actual repository URL.

### 2. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed in the terminal.

### 3. Start the backend

Open a second terminal from the repository root:

```bash
cd backend
npm install
npm run dev
```

The backend is configured for port `5050`. The exact available npm scripts depend on the `backend/package.json` configuration.

If the development script is not configured, check `backend/package.json` for the available scripts before starting the server.

### 4. Verify the backend

Once the server is running, execute:

```bash
curl http://localhost:5050/api/health
```

A successful response confirms that the health endpoint is reachable.

## Card Collection

Soulbound currently contains 12 predefined cards.

| Type | Cards |
|---|---|
| Units | Iron Knight, Shadow Assassin, Ember Wraith |
| Spells | Soulfire, Soul Rupture, Soul Mend |
| Relics | Soul Lantern, Crown of Ash, Mirror of Souls |
| Souls | Flame Soul, Shadow Soul, Iron Soul |

## Development Status

**In Development**

### Completed frontend work
- Reusable React card component.
- TypeScript card data definitions.
- Four card categories.
- Card artwork integration.
- Card-specific stats and descriptions.
- Interactive card selection.
- Dark-fantasy visual styling.

### Completed backend foundation
- Node.js and Express application setup.
- ES module configuration.
- CORS middleware.
- Nodemon development tooling.
- Server entry point and port configuration.
- Health-check endpoint.
- Modular route files for authentication, users, games, custom games, and rules.
- Initial placeholder authentication handlers and demonstration game handlers.

### Not yet implemented
- Complete authentication and authorization.
- User registration and login.
- Database connection and persistent storage.
- Deck creation, editing, and validation.
- Turn-based gameplay and combat resolution.
- Mana or resource management.
- Soul sacrifice and inheritance rules.
- Persistent match history.
- Multiplayer sessions and opponent AI.

These features are potential future development work, not existing functionality.

## License

No license has been specified yet. Add a license file before distributing the project under an open-source license.
