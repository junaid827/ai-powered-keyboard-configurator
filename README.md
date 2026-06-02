# AI-powered-keyboard-configurator

# ⌨️ KeyForge — AI Keyboard Configurator--V1

A next-gen e-commerce product configurator with a real-time 3D mechanical keyboard model, AI specialist chatbot (Max), and live configuration mutations.

## Stack

- **Vite + React** — fast SPA dev server
- **React Three Fiber + Drei** — declarative 3D scene
- **@react-three/postprocessing** — Bloom, Chromatic Aberration, Vignette
- **@react-spring/three** — smooth part swap animations
- **Zustand** — global config + chat state
- **MISTRAL API** — AI specialist with tool use
-      **User your desired LLM**

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Add your Anthropic API key
cp .env.example .env
# Edit .env and paste your key:

# 3. Start dev server
npm run dev
```

### 3D Scene

- Procedurally generated keyboard model with realistic materials
- Per-part material system (aluminum vs polycarbonate, RGB PCB glow)
- Smooth animated exploded view — parts float apart to reveal anatomy
- Hover highlighting synced with the config sidebar
- Post-processing: Bloom, Chromatic Aberration, Vignette

### AI Chatbot

- Has access to the full parts catalog and compatibility rules
- **Tool use**: can apply parts directly to your 3D model
- **Tool use**: can toggle exploded view
- **Tool use**: can highlight specific parts
- Compatibility analysis on demand-- Currently In Process

### Configurator

- 5 categories: Case, Switches, Keycaps, PCB, Plate
- Real-time compatibility checking with error/warning display
- Color swatches per part
- Live pricing summary -- Currently In Process

## Project Structure

```
src/
├── data/         — Parts catalog, compatibility rules, AI system prompt
├── store/        — Zustand stores (config + chat)
├── hooks/        — useAIChat (streaming + tool handling)
├── lib/          — AI tool definitions
└── components/
    ├── scene/    — R3F 3D keyboard (KeyboardScene, KeyboardModel)
    ├── configurator/ — PartSelector, ConfigSummary
    ├── chat/     — ChatPanel with streaming
    └── layout/   — Header, Sidebar
```

## Adding Real 3D Models

The current scene uses procedurally generated geometry. To upgrade to real GLTF models:

1. Export from Blender as `.glb` into `/public/models/`
2. In `KeyboardModel.jsx`, replace each `<RoundedBox>` with `<useGLTF>` loaded models
3. Name your Blender objects to match part IDs for easy swapping

## Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```
