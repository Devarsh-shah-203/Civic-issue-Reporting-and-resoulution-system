# CivicPulse — Crowdsourced Civic Issue Reporting & Resolution

Frontend for the Smart India Hackathon "Crowdsourced Civic Issue Reporting"
problem statement. Citizens report potholes, broken streetlights, garbage
overflow, water leakage, damaged roads, and fallen trees with an exact map
pin; municipal authorities track and resolve them through the same tickets.

## Stack

Next.js 14 (App Router, JavaScript) · Tailwind CSS · Axios · Context API ·
React-Leaflet / OpenStreetMap · Socket.IO client

## Running it

```bash
cd client
npm install
npm run dev
```

Open http://localhost:3000.

## Demo mode (no backend required)

This frontend is fully wired to run standalone. `services/mockDb.js` is a
localStorage-backed fake backend that every `*Service.js` file calls, so
you can demo the entire flow — register, log in, file a report, drop a map
pin, watch an authority move it through statuses, get notified — without
running any server.

Demo accounts (password: `password` for both):
- **Citizen:** citizen@demo.com
- **Municipal authority:** authority@demo.com

## Wiring up a real backend

Nothing in the UI needs to change — only the service layer:

1. Set `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_SOCKET_URL` in `.env.local`
   (copy `.env.example`).
2. In `services/authService.js`, `complaintService.js`, `profileService.js`,
   and `notificationService.js`, swap the `mockDb` calls for calls through
   the shared `api` instance in `services/axios.js` (already wired with
   auth headers + silent token refresh via `utils/refreshToken.js`).
3. Point `context/SocketContext.js` at your real Socket.IO server — it
   already connects and listens for `connect` / `disconnect`; add your
   server's `complaint:status_updated` (etc.) events and forward them
   into `NotificationContext` the same way `emitLocal` does now.

## Structure

See the file tree — pages live in `app/`, one folder per route; shared UI
in `components/`; state in `context/` + `hooks/`; data access in
`services/`; small pure helpers in `utils/`.

## Design notes

Complaints render as "ticket" cards (perforated left edge) with a rotated
status "stamp" — pending / in progress / resolved / rejected — leaning into
the idea that a civic complaint is an official, trackable document, not a
lost phone call. Space Grotesk for display type, Inter for body, IBM Plex
Mono for ticket IDs and timestamps.
