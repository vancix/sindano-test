# Singano

Mobile-first web app for Tanzanian airtime vouchers, emergency dialing, and mobile utility USSD shortcuts. Built for Android browsers and WebView.

## Features

- **Emergency** — one-tap dial for fire, ambulance, police, and more
- **Services** — USSD shortcuts (balance, bundles, M-Pesa, NIDA, etc.)
- **Scan voucher** — rear-camera OCR (Tesseract.js) and auto-recharge dial `*104*{code}#`
- **Which operator** — detect Vodacom, Airtel, Tigo, Halotel, or TTCL from phone number
- **PWA** — installable, offline-ready

## Tech stack

- React 19 + TypeScript
- Vite 8 + Tailwind CSS 4
- Framer Motion, Lucide React, Tesseract.js
- vite-plugin-pwa

## Setup

```bash
npm install
npm run dev
```

Open the dev server URL on your phone (same Wi‑Fi) for camera and `tel:` / USSD behavior.

## Scripts

| Command         | Description              |
|----------------|--------------------------|
| `npm run dev`  | Development server       |
| `npm run build`| Production build → `dist/` |
| `npm run preview` | Serve production build |
| `npm run lint` | ESLint                   |

## License

Private — all rights reserved.
