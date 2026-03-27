# Diet Helper

AI-powered dietary analysis app. Snap a photo of a meal, menu, or product label — or describe it — and get instant feedback tailored to your specific diet profile.

## Features

- **Multi-diet profiles** — Triglyceride Reduction, Keto, Mediterranean, Diabetic-Friendly, Heart-Healthy, General Healthy
- **Photo + text input** — Capture or upload food images, or type a description
- **AI analysis** — Sends food to an LLM (Gemini 2.5 Flash via OpenRouter) and returns a structured verdict (good / ok / avoid) with scores and tips
- **History** — Saves past analyses locally with export support
- **Dark mode** — Light, dark, and system theme options

## Tech Stack

- **Frontend**: React 19 + TypeScript, Vite
- **Backend**: FastAPI proxy on Railway (handles LLM API calls)
- **LLM provider**: OpenRouter (Gemini 2.5 Flash)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_ACCESS_TOKEN=your-access-token
```

To use mock responses locally (no backend needed):

```env
# .env.local
VITE_MOCK_API=true
```

Production values go in `.env.production.local` (gitignored).

### Development

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

### Build

```bash
npm run build
```

### Available Scripts

| Script                 | Description                         |
| ---------------------- | ----------------------------------- |
| `npm run dev`          | Start dev server                    |
| `npm run build`        | Type-check and build for production |
| `npm run lint`         | Run ESLint                          |
| `npm run format`       | Format code with Prettier           |
| `npm run format:check` | Check formatting without writing    |
| `npm run preview`      | Preview production build locally    |

## Project Structure

```
src/
├── App.tsx              # Main app component
├── main.tsx             # Entry point
├── types.ts             # Types, diet profiles, provider config
├── components/
│   ├── DietSelector.tsx # Diet profile dropdown
│   ├── Header.tsx       # App header
│   ├── HistoryList.tsx  # Analysis history with export
│   ├── PhotoCapture.tsx # Camera/upload input
│   ├── ResultCard.tsx   # Analysis result display
│   ├── Settings.tsx     # Theme settings (provider/model selection disabled)
│   └── TextInput.tsx    # Text description input
├── hooks/
│   ├── useHistory.ts    # History persistence (localStorage)
│   └── useSettings.ts   # Settings persistence (localStorage)
├── providers/
│   └── index.ts         # LLM API integration + response parsing
└── utils/
    └── imageUtils.ts    # Image compression/base64 helpers
```
