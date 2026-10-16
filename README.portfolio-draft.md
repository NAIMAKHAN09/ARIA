# A.R.I.A. — AI Prompt Refiner

A.R.I.A. (Ambiguity Resolution & Intent Analysis Agent) is an AI-powered application that helps transform rough ideas into structured prompts for large language models.

Instead of immediately rewriting an ambiguous request, the application proposes possible interpretations so the user can choose the intended direction before generating a refined prompt.

## Features

- Analyze rough or ambiguous user instructions.
- Present a recommended interpretation and alternative interpretations.
- Generate a refined, copy-ready prompt based on the selected intent.
- Use structured JSON responses for predictable application state.
- Explore additional AI-assisted media workflows present in the codebase.

## Technology Stack

- React
- TypeScript
- Vite
- Google Gen AI SDK
- Lucide React

## How It Works

1. The user submits an idea or instruction.
2. The application requests possible interpretations from an AI model.
3. The user selects the most appropriate interpretation.
4. A second generation step produces a structured prompt.
5. The interface displays the resulting prompt.

## Getting Started

### Prerequisites

- Node.js and npm
- A Google Gemini API key

### Installation

```bash
git clone https://github.com/NAIMAKHAN09/ARIA.git
cd ARIA
npm install
```

Configure the required API credentials in your local environment, then run:

```bash
npm run dev
```

Use `npm run build` to create a production build.

> API-key handling must be verified before deployment. Do not expose a private API key in browser-delivered code or commit credentials to Git.

## Project Structure

- `App.tsx` — primary application state and interaction flow
- `components/` — reusable interface components
- `services/` — AI generation and related service logic
- `types.ts` — TypeScript data types
- `index.tsx` — application entry point

## Engineering Focus

This project explores AI-assisted interaction design, structured model outputs, asynchronous application state, and the user experience of resolving ambiguous instructions.

## Future Improvements

- Add automated tests for interpretation and generation flows.
- Improve API error handling and configuration validation.
- Document supported models and API requirements.
- Add screenshots and a verified live demonstration.

## License

No license has been specified in this README proposal. Confirm the intended license before redistribution.
