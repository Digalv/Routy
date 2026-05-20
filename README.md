# Routy

Plan your European trip by comparing flights, trains, and buses — all in one place.

<!-- Screenshots -->
<!-- Add screenshots here -->

---

## Features

- **Multi-modal search** — flights, trains, and buses in a single query
- **Real-time results** — live data from Duffel (flights) and Transitous (trains)
- **Filtering & sorting** — filter by transport type and stops, sort by duration or price
- **Wishlist** — save and revisit searches across sessions
- **Authentication** — JWT-based sign up / sign in
- **City autocomplete** — powered by a curated list of European cities with station coordinates
- **Passenger count** — total price scales with the number of travellers

## Tech Stack

**Backend**
- Java 21, Spring Boot 3
- Spring Security + JWT
- MongoDB
- JaCoCo (coverage gate ≥ 80%)

**Frontend**
- React 18, TypeScript, Vite
- React Router v6
- Tailwind CSS

**DevOps**
- Docker & Docker Compose
- GitHub Actions CI
- SonarCloud static analysis

## Getting Started

### Prerequisites

- Docker and Docker Compose
- A [Duffel](https://duffel.com) API token

### Setup

1. Clone the repository

   ```bash
   git clone https://github.com/Digalv/Routy.git
   cd Routy
   ```

2. Create a `.env` file in the root directory

   ```env
   DUFFEL_TOKEN=your_duffel_token_here
   JWT_SECRET=your_base64_encoded_secret_here
   ```

3. Start the application

   ```bash
   docker compose up --build
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Architecture Overview

```
Routy
├── backend/                 Spring Boot application
│   └── src/main/java/com/routy/
│       ├── adapter/
│       │   ├── flight/      Duffel integration (flights)
│       │   └── transit/     Transitous integration (trains)
│       ├── orchestrator/    Calls providers in parallel, merges results
│       ├── auth/            JWT authentication
│       ├── wishlist/        Wishlist CRUD
│       └── web/             REST controllers
└── frontend/                React + TypeScript SPA
```

### Transport Providers

| Provider | Coverage | Docs |
|---|---|---|
| [Duffel](https://duffel.com) | Flights across Europe | [API Docs](https://duffel.com/docs/api) |
| [Transitous](https://transitous.org) | Regional & intercity trains | [API Docs](https://api.transitous.org) |

The orchestrator calls both providers in parallel via `CompletableFuture`, handles per-provider failures gracefully, and returns a merged list sorted by the chosen criteria.
