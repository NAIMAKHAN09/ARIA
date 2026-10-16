# A.R.I.A. — AI Prompt Refiner

A.R.I.A. (Ambiguity Resolution & Intent Analysis Agent) is an AI-assisted prompt-refinement prototype. It helps turn a rough idea into a more specific prompt by showing possible interpretations before generating a final, copy-ready prompt.

## What It Does

- Analyzes a user's initial idea and returns a recommended interpretation plus alternatives.
- Lets the user select the interpretation that best matches their intent.
- Generates a structured prompt based on the original idea and selected interpretation.
- Uses schema-constrained JSON responses for the interpretation and final-output steps.
- Includes additional media-related service functions in the codebase; their end-to-end UI workflows should be verified before being described as completed features.

## Technology Stack

- React 19 and TypeScript
- Vite
- Google Gen AI SDK (`@google/genai`)
- Lucide React
- Tailwind utility classes in the interface

## How the Main Flow Works

1. Enter a rough idea or instruction.
2. A Gemini model proposes one recommended interpretation and three alternatives.
3. Select the interpretation that best reflects the intended outcome.
4. A second generation step creates a refined prompt.
5. Review the result and use it in the AI tool of your choice.

The implementation currently references Gemini models in the service layer. Model availability and API access depend on the Google AI account and configuration in use.

## Run Locally

### Prerequisites

- Node.js and npm
- A Google Gemini API key

### Install and start

```bash
git clone https://github.com/NAIMAKHAN09/ARIA.git
cd ARIA
npm install
```

Create a local `.env.local` file in the project root with your key:

```dotenv
GEMINI_API_KEY=your_gemini_api_key
```

Then start the development server:

```bash
npm run dev
```

Vite is configured to serve the app on port 3000. Create a production build with:

```bash
npm run build
```

**Deployment note:** the current Vite configuration injects the Gemini key into client-side code. Treat this as a prototype configuration, do not use a private key in a public deployment, and move model calls behind a server-side endpoint before production use. Never commit real credentials.

## Key Files

- `App.tsx` — main application state and interaction flow
- `components/` — interface components
- `services/geminiService.ts` — Gemini model calls and response handling
- `types.ts` — application response and state types
- `index.tsx` — React entry point
- `vite.config.ts` — development server and environment configuration

## Engineering Focus

A.R.I.A. explores human-in-the-loop prompt refinement, structured model responses, asynchronous UI state, and interaction design for resolving ambiguous instructions.

## Potential Next Steps

- Add tests for interpretation and final prompt generation.
- Improve error handling for missing credentials, rate limits, and invalid model responses.
- Document supported model choices and API requirements.
- Add screenshots and a verified demo link.

## License

No license is specified in this draft. Confirm the intended license before distributing or reusing the project.
