# GlobalMart Owner

Expo (React Native) companion app for the shop owner. Connects to the **GlobalMart report API** for login, reports, and orders the till picks up. Pricing and payment happen at the till.

## Screens

| Tab | What it does |
|---|---|
| **Login** | Server URL + Basic auth (`REPORT_API_USER` / `REPORT_API_PASSWORD`) |
| **Sell** | Products from `GET /reports/stock` + `GET /catalog`, cart, **Send to cashier** (`POST /orders`) |
| **Orders** | `GET /orders`: status, reject reason, **Cancel** while waiting (`POST /orders/:id/cancel`) |
| **Reports** | Grouped list + detail with date presets |
| **Settings** | Night mode, log out |

## Requirements

- Node 20+ and npm
- Expo Go on a phone (or emulator)
- A running [globalmart-report-api](../globalmart-report-api) on the same Wi‑Fi

## Run

```sh
cd globalmart-owner-app
npm install
npm start
```

Scan the QR code with Expo Go.

### Point the phone at the report API

On the PC:

```sh
HOST=0.0.0.0 PORT=4100 REPORT_API_USER=owner REPORT_API_PASSWORD='…' POS_DB_PATH='/path/to/pos.db' pnpm start
```

In the app login / Settings, use the PC’s **LAN IP**, e.g. `http://192.168.1.42:4100` — not `127.0.0.1`.

Android cleartext HTTP is enabled for shop use, but the app only accepts `http://` for LAN addresses (localhost, 10.x, 172.16–31.x, 192.168.x); any other host must be `https://`.

## Stack

- Expo Router, TypeScript
- Redux Toolkit (slices for auth, theme, cart, report period) + RTK Query (all server data), zod (validation layer)
- expo-secure-store (server URL + credentials)
- DM Sans, light retail/agri theme

## Structure

```
app/                  Route files only: each re-exports a screen from src/features
src/
  api/                http.ts (the one fetch: auth, https rule, error mapping, zod check), baseQuery, baseApi
  store/              configureStore + typed hooks
  bootstrap/          fonts, saved state, splash, login redirect
  features/<name>/
    *.schemas.ts      validation layer: zod schemas for the API's DTOs and the forms
    *Slice.ts         Redux state (auth, theme, cart, period)
    *Api.ts           RTK Query endpoints (catalog, orders, reports)
    use*.ts           hook layer: the only thing screens call for data and actions
    *Screen.tsx, components/   presentational UI
  shared/             ui kit, layout, theme tokens, money/uuid/url helpers
```

Screens never call the API or the store directly; they use the feature hooks (`useSellProducts`, `useSendOrder`, `useOrders`, `useReport`, `useLoginForm`, …).

## Orders

- Orders need the **cloud** server (`DATABASE_URL` set); a local server answers 404 and the app says so.
- The order id is a client-made UUIDv7 and the API's idempotency key. The same cart retried reuses its id.
- Lines carry ids and quantities only; the till prices them. Products not sold loose are sent with their default pack (`selling_option_id`), one pack per tap; the till rejects them otherwise.
- Stock is the server's copy (up to `SNAPSHOT_MINUTES` old); the Sell header shows its age.
