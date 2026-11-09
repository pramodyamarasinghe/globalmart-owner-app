# GlobalMart Owner

Expo (React Native) companion app for the shop owner. Connects to the **GlobalMart report API** for login, reports, and in-stock product staging. Checkout / pay is stubbed until POS write APIs exist.

## Screens

| Tab | What it does |
|---|---|
| **Login** | Server URL + Basic auth (`REPORT_API_USER` / `REPORT_API_PASSWORD`) |
| **POS** | Product list from `GET /reports/stock`, cart, **Send to cashier** (local queue) |
| **Cashier** | Pending staged tickets; **Done** clears locally; **Pay** disabled |
| **Reports** | Grouped list + detail with date presets |
| **Settings** | URL, credentials, test connection, logout, LAN setup notes |

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

Android cleartext HTTP to the LAN is allowed for shop use (`usesCleartextTraffic`). Prefer HTTPS if you ever expose beyond the shop network.

## Stack

- Expo Router, TypeScript
- Zustand (cart + cashier queue)
- expo-secure-store (password), AsyncStorage (base URL)
- DM Sans, light retail/agri theme

## What is real vs local

- **Real API:** health, reports list/detail, stock for POS
- **Local only:** send-to-cashier queue and Pay (wire later to POS checkout APIs)
