
## Requirements

- Docker Desktop with Docker Compose, or Node.js 20.19+ and npm
- A SerpApi API key

## Local setup

Copy `.env.example` to `.env` and replace the placeholder with your SerpApi API key. 

### Docker Compose

Run `docker compose up --build`, then open <http://localhost:5173>. The source files are mounted into the container, so changes are reflected during development. Stop with `Ctrl+C`; remove the container with `docker compose down`.

Port 5173 must be free. Stop any local `npm run dev` process before starting Compose.

### Without Docker

Run `npm ci`, then `npm run dev`, and open the URL printed by Vite.

## Checks

Run `npm test` for unit tests, `npm run lint:styles` for SCSS linting, and `npm run build` for the production build.

## Deploy to Render

Create a **Web Service** from this repository with Node.js 20.19 or newer:

- Build command: `npm ci && npm run build`
- Start command: `npm start`
- Environment variable: `SERPAPI_KEY` set to your private SerpApi key

The production server serves both `dist/` and `/api/search` on the port provided by the host. Do not upload `.env` or put the key in a `VITE_` variable. A public deployment lets visitors use your SerpApi quota; add access controls or rate limiting before sharing it widely.
