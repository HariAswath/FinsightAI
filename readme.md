# README.md - FinsightAI

```markdown
# FinsightAI — Autonomous Multi-Agent Financial Intelligence Platform

> **Tagline**: *"From Market Data to Personalized Intelligence"*
>
> FinsightAI is a **next-generation autonomous AI system for retail investors** that bridges the gap between raw financial data and actionable, personalized investment intelligence. It leverages a sophisticated multi-agent orchestration architecture that executes specialized AI agents in parallel to analyze stocks across technical, fundamental, and sentiment dimensions—then personalizes recommendations based on individual portfolio context and risk tolerance.

---

## 🎯 Core Problem & Solution

### The Market Gap
Most investment platforms treat all investors equally: they display the same market data, the same analyst ratings, and the same buy/sell signals to everyone. This ignores a fundamental truth of investing:

**`SAME STOCK + SAME MARKET DATA + DIFFERENT USER = DIFFERENT DECISION`**

### Our Innovation
FinsightAI solves this by introducing **dynamic personalization at the decision layer**. The market view stays consistent, but the recommendation adapts based on:
- **Portfolio concentration** (existing exposure to the stock)
- **Risk tolerance** (conservative → moderate → aggressive)
- **Investment horizon** (short-term trading vs. long-term wealth building)
- **Real-time signal conflicts** (when agents disagree, confidence is automatically dampened)

### Live Example: RELIANCE Stock
Both users see the same market fundamentals (BULLISH 76% confidence), but:

| Dimension | User A (Conservative, 30% Exposure) | User B (Aggressive, 5% Exposure) |
|-----------|-------------------------------------|----------------------------------|
| **Market View** | 🟢 BULLISH (76%) | 🟢 BULLISH (76%) |
| **Personalized Decision** | 🟡 **SMALL ADD** | 🟢 **CONSIDER BUY** |
| **Reasoning** | High concentration risk; positive signals present but capital allocation capped | Low exposure + bullish signals + growth momentum = full opportunity capture |

---

## 📊 Technical Architecture

### System Stack
- **Language**: TypeScript 99.3% (full-stack type safety)
- **Backend**: Node.js + Express.js v5 + Protobuf message handling
- **Frontend**: Next.js 16 + React 19 + Tailwind CSS v4 + Three.js (3D visualization)
- **Market Data**: Upstox V3 WebSocket feed with Protobuf binary decoding
- **LLM Integration**: Groq + OpenAI API clients (multi-provider fallback)
- **UI Design**: Dark space aesthetic (Mecha Pay inspired) with glassmorphic components + interactive 3D cards

### Project Structure

```
FinsightAI/
├── backend/                                # Express.js REST API + WebSocket Server
│   ├── src/
│   │   ├── server.ts                      # HTTP + WebSocket bootstrap
│   │   ├── app.ts                         # Express app setup, middleware, routes
│   │   ├── market/                        # Live market data layer
│   │   │   ├── market.service.ts          # Quote cache, symbol registry, Upstox feed
│   │   │   ├── market.controller.ts       # /api/market/* endpoints
│   │   │   ├── market.routes.ts           # Route definitions
│   │   │   ├── market.data.ts             # Historical OHLC snapshots
│   │   │   ├── symbol-registry.ts         # NSE/BSE equity metadata
│   │   │   ├── upstox.ts                  # Upstox API client wrapper
│   │   │   ├── types.ts                   # QuoteSnapshot, MarketEvent interfaces
│   │   │   ├── broadcaster/               # WebSocket broadcaster for real-time updates
│   │   │   │   └── ws-broadcaster.ts
│   │   │   ├── providers/                 # Market data provider implementations
│   │   │   ├── proto/                     # Protobuf definitions for binary decoding
│   │   │   ├── storage/                   # Optional market data persistence
│   │   │   └── interfaces/                # MarketDataProvider contract
│   │   └── ai/                            # Multi-Agent AI Subsystem
│   │       ├── ai.service.ts              # Main AI orchestration facade
│   │       ├── ai.controller.ts           # HTTP /api/ai/* endpoints + SSE streaming
│   │       ├── ai.routes.ts               # Route definitions
│   │       ├── agents/                    # Specialized parallel agents
│   │       │   ├── base.agent.ts          # Agent base class
│   │       │   ├── technical.agent.ts     # Price action, RSI, MACD analysis
│   │       │   ├── fundamentals.agent.ts  # RAG filings retrieval + LLM synthesis
│   │       │   └── sentiment.agent.ts     # News sentiment parsing
│   │       ├── orchestration/             # Agent execution coordination
│   │       │   ├── agent.orchestrator.ts  # Parallel Promise.allSettled execution
│   │       │   └── trace.emitter.ts       # Real-time event emission for SSE
│   │       ├── synthesis/                 # Cross-agent signal reconciliation
│   │       │   └── synthesis.agent.ts     # Consensus logic + conflict detection
│   │       ├── rag/                       # Retrieval-Augmented Generation
│   │       │   └── vector.store.ts        # Embedding lookup for filing chunks
│   │       ├── personalization/           # User profile application
│   │       │   ├── personalization.engine.ts  # Profile → Signal adjustment
│   │       │   └── portfolio.analyzer.ts      # Concentration score calculation
│   │       ├── recommendation/            # Final recommendation assembly
│   │       │   └── recommendation.engine.ts   # Recommendation synthesis
│   │       ├── llm/                       # LLM client abstraction
│   │       │   └── llm.client.ts          # Groq/OpenAI multi-provider wrapper
│   │       └── types/                     # TypeScript interfaces
│   │           ├── profile.types.ts       # UserProfile, PRESET_PROFILES
│   │           ├── agent.types.ts         # AgentOutput, AgentTraceEvent
│   │           └── recommendation.types.ts # FinalRecommendation
│   ├── package.json                       # Dependencies
│   ├── tsconfig.json
│   ├── .env.example
│   └── tests/
│       └── ai-integration.test.ts         # Multi-agent pipeline tests
│
└── frontend/                              # Next.js 16 Interactive Dashboard
    ├── src/
    │   ├── app/                           # Next.js App Router
    │   │   ├── page.tsx                   # Main intelligent dashboard
    │   │   ├── layout.tsx                 # Root layout wrapper
    │   │   └── globals.css                # Dark space design tokens
    │   ├── components/                    # Reusable React components
    │   │   ├── 3d/                        # Interactive 3D visualizations
    │   │   │   ├── floating-card.tsx      # Glassmorphic 3D card with parallax tilt
    │   │   │   └── node-mesh.tsx          # WebGL agent network node visualizer
    │   │   ├── landing/                   # Mecha Pay hero landing page
    │   │   │   ├── hero-section.tsx
    │   │   │   └── feature-grid.tsx
    │   │   ├── dashboard/                 # Core analysis dashboard
    │   │   │   ├── synthesis-card.tsx     # Market View vs Personalized Decision
    │   │   │   ├── agent-card.tsx         # Individual agent output display
    │   │   │   ├── explainability-panel.tsx # 7-step reasoning accordion
    │   │   │   ├── metrics-panel.tsx      # Latency, confidence, performance telemetry
    │   │   │   ├── demo-controls.tsx      # Fault injection toggles
    │   │   │   ├── index-chart.tsx        # Market summary area chart
    │   │   │   ├── market-heatmap.tsx     # Sector heatmap grid
    │   │   │   └── top-stories.tsx        # News feed + market indices
    │   │   ├── analysis/                  # Stock analysis components
    │   │   │   ├── technical-gauge.tsx    # RSI/MACD gauge meter
    │   │   │   └── financials-card.tsx    # P/E, earnings, sector info
    │   │   ├── navigation/                # Top navbar & modals
    │   │   │   ├── main-nav.tsx           # Tab navigation + profile selector
    │   │   │   └── search-modal.tsx       # Global symbol search overlay
    │   │   ├── onboarding/                # User profile setup
    │   │   │   └── personalization-form.tsx # Risk profile form wizard
    │   │   └── watchlist/                 # Watched stocks table
    │   │       └── watchlist-table.tsx
    │   ├── services/                      # Business logic & API clients
    │   │   └── agent-engine.ts            # Multi-agent orchestration logic (client-side)
    │   ├── types/                         # TypeScript interfaces
    │   │   └── index.ts                   # Shared types (MarketData, AgentOutput, etc.)
    │   └── public/                        # Static assets
    │
    ├── package.json
    ├── tsconfig.json
    ├── next.config.ts
    ├── postcss.config.mjs
    └── tailwind.config.ts
```

---

## 🤖 Multi-Agent Architecture Deep Dive

### Agent Execution Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER QUERY (Symbol)                      │
│                        "Analyze RELIANCE"                       │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
        ┌───────────────────┐
        │   ORCHESTRATOR    │ (Parallel execution coordinator)
        └────┬──────────────┘
             │
    ┌────────┼────────┬─────────────┐
    │        │        │             │
    ▼        ▼        ▼             ▼
┌───────┐ ┌──────┐ ┌────────┐ (Sequential)
│TECH   │ │FUND  │ │SENT    │
│AGENT  │ │AGENT │ │AGENT   │
│       │ │(RAG) │ │        │
│RSI    │ │      │ │News    │
│MACD   │ │10-K  │ │Calls   │
│MA     │ │      │ │        │
│82%✓   │ │79%✓  │ │71%✓    │
└───┬───┘ └──┬───┘ └────┬───┘
    │        │         │
    └────────┼─────────┘
             │
             ▼
        ┌──────────────────┐
        │ RISK AGENT       │ (Portfolio Context)
        │ Concentration:   │
        │ User A: 60/100   │
        │ User B: 10/100   │
        └────┬─────────────┘
             │
             ▼
        ┌──────────────────────┐
        │ SYNTHESIS AGENT      │
        │ Consensus: BULLISH   │
        │ Confidence: 76%      │
        │ Conflict: NONE       │
        └────┬─────────────────┘
             │
             ▼
        ┌──────────────────────────┐
        │ PERSONALIZATION ENGINE   │
        │ Apply Profile:           │
        │ → User A: SMALL_ADD      │
        │ → User B: CONSIDER_BUY   │
        └────┬─────────────────────┘
             │
             ▼
        ┌────────────────────────────┐
        │ FINAL RECOMMENDATION       │
        │ Action + Explanation       │
        │ + Citations + Traces       │
        └────────────────────────────┘
```

### The Five Agents

1. **Technical Agent** (`technical.agent.ts`)
   - Analyzes price action, volume, momentum indicators
   - Inputs: RSI, MACD histogram, moving average alignment
   - Output: Signal (BULLISH/BEARISH/NEUTRAL) + confidence (0-1) + reasons
   - Latency: ~1.2s

2. **Fundamental Agent** (`fundamentals.agent.ts`)
   - Retrieves statutory filing chunks via RAG vector store
   - Uses LLM to synthesize financial metrics and management guidance
   - Outputs: Signal + page-level citations with snippets
   - Latency: ~1.8s (RAG retrieval + LLM)

3. **Sentiment Agent** (`sentiment.agent.ts`)
   - Parses news headlines and earnings call transcripts
   - Calculates positive/negative ratio
   - Outputs: Signal + reason + news count
   - Latency: ~1.4s (can gracefully degrade if news feed offline)

4. **Risk Agent** (in `personalization.engine.ts`)
   - Evaluates portfolio concentration (0-100 score)
   - Flags sector rotation risks
   - Applies user profile (conservative/moderate/aggressive)
   - Latency: ~400ms (synchronous)

5. **Synthesis Agent** (`synthesis.agent.ts`)
   - Reconciles conflicting signals from Agents 1-3
   - Detects signal divergence (e.g., Technical BULLISH vs Sentiment BEARISH)
   - Outputs: Consensus signal + conflict flags + confidence dampening
   - Latency: ~1.1s

---

## 🎨 Frontend UX & Visual Design

### Design System
- **Color Palette**: Pitch-dark space background (`#090A0F`), cyan/blue accents, amber highlights
- **Components**: Glassmorphic cards (`border-white/10`, `backdrop-blur`), capsule pills, micro-caps badges
- **Typography**: Monospace font for financial data, sans-serif for UI text
- **Animations**: Framer Motion fade-in/slide-up transitions, 3D parallax tilt on cards

### Six Main Views
1. **Dashboard**: Market summary chart + sector heatmap + top stories
2. **Analysis**: Multi-agent results + synthesis card + agent cards + explainability
3. **Heatmap**: Interactive sector rotation grid
4. **Watchlist**: Curated stock list with alerts
5. **News Feed**: Real-time market intelligence
6. **Personalization**: Risk profile onboarding form

### Interactive 3D Features (Three.js)
- **Floating 3D Cards**: Parallax tilt physics on hover showing agent outputs in glassmorphic 3D
- **Node Mesh Visualizer**: WebGL dynamic mesh showing data flows between agents in real-time
- **Live Quote Ticker**: 3D text rendering of stock symbols and prices

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** v18+ and npm
- **Upstox API credentials** (for market data) or mock fallback available
- **LLM API keys** (Groq and/or OpenAI) — optional, demo mode runs without them

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Environment
Create `backend/.env`:
```env
PORT=5000
UPSTOX_API_KEY=your_upstox_key_here
GROQ_API_KEY=your_groq_key_here
OPENAI_API_KEY=your_openai_key_here
```

### Step 3: Start Backend Server
```bash
npm run dev
# Output:
# 🚀 FinsightAI Backend Server running on port 5000
# 📡 Market Quotes: http://localhost:5000/api/market/quotes
# 🤖 AI Analyze:    POST http://localhost:5000/api/ai/analyze
# ⚡ WebSocket:     ws://localhost:5000/ws/market
```

### Step 4: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### Step 5: Start Frontend Development Server
```bash
npm run dev
# Output:
# ▲ Next.js 16.3.4
# - Local:        http://localhost:3000
# ✓ Ready in 3.2s
```

### Step 6: Open in Browser
Navigate to `http://localhost:3000` and start exploring!

---

## 📡 Backend API Endpoints

### Market Data
- `GET /api/market/quotes` — Fetch all cached symbol quotes
- `GET /api/market/:symbol` — Fetch single symbol comprehensive data
- `GET /api/market/history/:symbol` — Fetch OHLC history
- `WebSocket /ws/market` — Live quote stream (subscribe to symbols)

### AI Multi-Agent Analysis
- `POST /api/ai/analyze` — Execute full multi-agent pipeline (one-shot JSON response)
  ```json
  {
    "symbol": "RELIANCE",
    "profileId": "conservative",
    "simulateFailure": false
  }
  ```
- `GET /api/ai/analyze/stream?symbol=RELIANCE` — Server-Sent Events stream (real-time agent traces)
- `GET /api/ai/compare-profiles?symbol=RELIANCE` — Compare decisions across all 3 profiles
- `GET /api/ai/profiles` — List available user profiles (conservative/moderate/aggressive)
- `GET /api/ai/sample-portfolio` — Get example portfolio context
- `GET /api/ai/status` — Check AI subsystem health + provider status

---

## 🧪 Hackathon Demo Flow

### For Judges & Demo Evaluators

1. **Landing Page (http://localhost:3000)**
   - View Mecha Pay-style hero with 3D floating cards
   - Observe interactive 3D node mesh showing agent network
   - Click **"Launch App ↗"** to enter main dashboard

2. **Dashboard Overview**
   - Inspect market summary, sector heatmap, top stories
   - Select any stock from heatmap to trigger analysis

3. **Multi-Agent Analysis Execution**
   - Navigate to **"Analysis"** tab
   - Select **"RELIANCE"** from stock selector
   - Click **"Re-Run Multi-Agent Engine"**
   - Watch real-time SSE traces stream in (if using stream endpoint)
   - Observe parallel agent outputs: Technical (82%), Fundamental (79%), Sentiment (71%)

4. **Personalization Demo (THE CORE DIFFERENTIATOR)**
   - View **"Market View: BULLISH 76%"** (consensus from all 3 agents)
   - Switch profile pill from **"User A (Conservative)"** → **"User B (Aggressive)"**
   - Notice **Personalized Decision changes**:
     - User A: 🟡 **SMALL ADD** (30% existing exposure limits capital allocation)
     - User B: 🟢 **CONSIDER BUY** (5% exposure allows full opportunity capture)
   - Same market data, different user context = different decision ✓

5. **RAG Citations & Explainability**
   - Click on Fundamental Agent card to view source citations
   - Inspect **"Q1 FY27 Statutory Filing, Page 12"** snippet
   - Open **"How did AI reach this decision?"** accordion
   - Review 7-step reasoning chain with agent names and latency

6. **Fault Tolerance Testing**
   - Toggle **"Simulate Missing News Data"** switch
   - Notice confidence drops: `76% → 61%` (Sentiment agent unavailable)
   - Toggle **"Simulate Signal Disagreement"** switch
   - Observe **⚠ SIGNAL CONFLICT DETECTED** warning
   - See recommendation auto-adjust to **"WATCH"** (conservative fallback)

7. **Performance Metrics**
   - Scroll to **"Telemetry Metrics Panel"**
   - View total latency: `~4.5s (all agents parallel)`
   - Inspect per-agent breakdown: Tech 1.2s, Fund 1.8s, Sent 1.4s, Synth 1.1s

---

## 🛡️ AI Safety & Disclaimers

> ⚠️ **Important**: FinsightAI provides AI-generated research synthesis **for educational and informational demonstration purposes only**. This is **NOT financial advice**. All recommendations should be independently verified with licensed financial advisors before making investment decisions. The system can experience data degradation, signal conflicts, and model hallucinations.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000                          # Server port
UPSTOX_API_KEY=xxx                 # Upstox market data API
GROQ_API_KEY=xxx                   # Groq LLM provider (preferred)
OPENAI_API_KEY=xxx                 # OpenAI fallback provider
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 🧑‍💻 Development & Testing

### Run Backend Tests
```bash
cd backend
npm run test:ai
```

### Run Frontend Build
```bash
cd frontend
npm run build
npm start
```

### Lint & Format
```bash
# Backend
cd backend && npx ts-node --esm src/server.ts

# Frontend
cd frontend && npm run lint
```

---

## 📈 Future Roadmap

- [ ] Persistent PostgreSQL storage for historical agent traces
- [ ] Real Upstox WebSocket connection with Protobuf binary decoding
- [ ] Integration with institutional-grade RAG systems (Langchain, LlamaIndex)
- [ ] Portfolio optimization engine with Markowitz frontier analysis
- [ ] Real-time alert system for concentration breaches and signal conflicts
- [ ] Mobile native app (React Native)
- [ ] Multi-asset support (crypto, forex, commodities)

---

## 📚 Documentation & Resources

- **Architecture Spec**: See `/docs` directory
- **Agent Behavior**: See `frontend/AGENTS.md`
- **API Reference**: Swagger/OpenAPI docs available at `/api/docs` (when enabled)

---

## 🤝 Contributing

This project was built for **Hackverse 2026**. Contributions, bug reports, and feature suggestions are welcome!

---

## 📄 License

ISC License (see LICENSE file)

---

## 👨‍💼 Author

**Hari Aswath** (@HariAswath)

---

## 💬 Support

For issues or questions:
1. Check existing GitHub issues
2. Review the `/docs` folder for architectural details
3. Open a new issue with detailed reproduction steps

---

**FinsightAI — Autonomous Financial Intelligence for Retail Investors**
```

---

## 📊 Complete Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                           FinsightAI SYSTEM ARCHITECTURE                         │
└──────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND LAYER (Next.js 16)                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐          │
│  │  Landing Page    │    │  Dashboard View  │    │  Analysis View   │          │
│  │  - Hero Section  │    │  - Index Chart   │    │  - Stock Picker  │          │
│  │  - 3D Cards      │    │  - Heatmap       │    │  - Agent Cards   │          │
│  │  - Node Mesh     │    │  - Top Stories   │    │  - Synthesis     │          │
│  └──────────────────┘    └──────────────────┘    └──────────────────┘          │
│                                                                                 │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐          │
│  │  Watchlist View  │    │  News Feed       │    │  Personalization │          │
│  │  - Stock Table   │    │  - Market News   │    │  - Profile Form  │          │
│  │  - Alerts        │    │  - Sentiment     │    │  - Risk Selector │          │
│  └──────────────────┘    └──────────────────┘    └──────────────────┘          │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐        │
│  │              Agent Engine Service (Orchestration)                   │        │
│  │  - runMultiAgentAnalysis()                                          │        │
│  │  - Parallel Agent Execution Coordinator                            │        │
│  │  - Profile Personalization Logic                                   │        │
│  │  - Cache Management                                                │        │
│  └─────────────────────────────────────────────────────────────────────┘        │
│                                                                                 │
│  Stack: React 19, Tailwind CSS 4, Three.js, Framer Motion                     │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                    HTTP / WebSocket │ REST API + SSE Stream
                                    │
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            BACKEND LAYER (Express.js)                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌──────────────────────────────────────────────────────────────────────┐       │
│  │                     AI Multi-Agent Subsystem                         │       │
│  ├──────────────────────────────────────────────────────────────────────┤       │
│  │                                                                      │       │
│  │  AIService (Facade)                                                │       │
│  │  ├─ AIController (HTTP Handlers + SSE)                            │       │
│  │  ├─ AgentOrchestrator (Parallel Execution)                        │       │
│  │  ├─ SynthesisAgent (Signal Reconciliation)                        │       │
│  │  ├─ PersonalizationEngine (Profile Application)                   │       │
│  │  ├─ PortfolioAnalyzer (Concentration Scoring)                     │       │
│  │  └─ RecommendationEngine (Final Assembly)                         │       │
│  │                                                                     │       │
│  │  ┌─────────────────────────────────────────────────────────┐       │       │
│  │  │  PARALLEL AGENT EXECUTION (Promise.allSettled)          │       │       │
│  │  │                                                         │       │       │
│  │  │  ┌───────────────────┐  ┌──────────────────────┐        │       │       │
│  │  │  │ Technical Agent   │  │ Fundamental Agent    │        │       │       │
│  │  │  │ - RSI Analysis    │  │ (RAG-Enhanced)       │        │       │       │
│  │  │  │ - MACD Crossover  │  │ - Vector Store Query │        │       │       │
│  │  │  │ - Volume Trends   │  │ - LLM Synthesis      │        │       │       │
│  │  │  │ - MA Alignment    │  │ - Citation Extraction│        │       │       │
│  │  │  │ Signal: BULLISH   │  │ Signal: BULLISH      │        │       │       │
│  │  │  │ Confidence: 82%   │  │ Confidence: 79%      │        │       │       │
│  │  │  │ Latency: 1.2s     │  │ Latency: 1.8s        │        │       │       │
│  │  │  └───────────────────┘  └──────────────────────┘        │       │       │
│  │  │                                                         │       │       │
│  │  │  ┌──────────────────────┐                              │       │       │
│  │  │  │ Sentiment Agent      │                              │       │       │
│  │  │  │ - News Parsing       │                              │       │       │
│  │  │  │ - Sentiment Scoring  │                              │       │       │
│  │  │  │ - Call Transcripts   │                              │       │       │
│  │  │  │ Signal: POSITIVE     │                              │       │       │
│  │  │  │ Confidence: 71%      │                              │       │       │
│  │  │  │ Latency: 1.4s        │                              │       │       │
│  │  │  │ (Can degrade if feed offline)                        │       │       │
│  │  │  └──────────────────────┘                              │       │       │
│  │  │                                                         │       │       │
│  │  └─────────────────────────────────────────────────────────┘       │       │
│  │                          ▼                                         │       │
│  │  ┌─────────────────────────────────────────────────────────┐       │       │
│  │  │  Synthesis Agent (Signal Reconciliation)                │       │       │
│  │  │  - Conflict Detection (Tech BULLISH vs Sent BEARISH)   │       │       │
│  │  │  - Confidence Dampening Logic                          │       │       │
│  │  │  - Consensus Building                                  │       │       │
│  │  │  Market View: BULLISH                                  │       │       │
│  │  │  Confidence: 76% (consensus)                           │       │       │
│  │  │  Conflict: NONE                                        │       │       │
│  │  └─────────────────────────────────────────────────────────┘       │       │
│  │                          ▼                                         │       │
│  │  ┌─────────────────────────────────────────────────────────┐       │       │
│  │  │  Risk & Personalization Layer                           │       │       │
│  │  │  - Portfolio Concentration Scoring (0-100)             │       │       │
│  │  │  - User Profile Application (Conservative/Mod/Aggr)    │       │       │
│  │  │  - Sector Rotation Risk Detection                       │       │       │
│  │  │                                                         │       │       │
│  │  │  User A (Conservative, 30% RELIANCE):                  │       │       │
│  │  │  → Personalized Decision: SMALL_ADD                    │       │       │
│  │  │                                                         │       │       │
│  │  │  User B (Aggressive, 5% RELIANCE):                     │       │       │
│  │  │  → Personalized Decision: CONSIDER_BUY                 │       │       │
│  │  └─────────────────────────────────────────────────────────┘       │       │
│  │                          ▼                                         │       │
│  │  ┌─────────────────────────────────────────────────────────┐       │       │
│  │  │  Final Recommendation Assembly                          │       │       │
│  │  │  - Action: [STRONG_BUY|CONSIDER_BUY|HOLD|SMALL_ADD]    │       │       │
│  │  │  - Explanation: Multi-paragraph reasoning              │       │       │
│  │  │  - Citations: Page-level RAG references                │       │       │
│  │  │  - Traces: Real-time agent event log                   │       │       │
│  │  │  - Metadata: Latency, confidence, timestamps           │       │       │
│  │  └─────────────────────────────────────────────────────────┘       │       │
│  │                                                                     │       │
│  └──────────────────────────────────────────────────────────────────────┘       │
│                                                                                 │
│  ┌──────────────────────────────────────────────────────────────────────┐       │
│  │                   Market Data Layer                                  │       │
│  ├──────────────────────────────────────────────────────────────────────┤       │
│  │                                                                      │       │
│  │  MarketService                                                     │       │
│  │  ├─ Quote Cache (in-memory, 30s TTL)                              │       │
│  │  ├─ Symbol Registry (NSE/BSE equity metadata)                     │       │
│  │  ├─ Upstox V3 API Client (market data source)                     │       │
│  │  ├─ WebSocket Market Broadcaster (live updates)                  │       │
│  │  └─ Fallback Mock Data (when Upstox unavailable)                 │       │
│  │                                                                      │       │
│  │  Data Flow:                                                        │       │
│  │  Upstox WebSocket → Protobuf Decoder → Quote Cache → Frontend    │       │
│  │                                                                      │       │
│  └──────────────────────────────────────────────────────────────────────┘       │
│                                                                                 │
│  ┌──────────────────────────────────────────────────────────────────────┐       │
│  │                     HTTP Routing Layer                               │       │
│  ├──────────────────────────────────────────────────────────────────────┤       │
│  │                                                                      │       │
│  │  /api/market/*                                                     │       │
│  │  ├─ GET /quotes                 → All cached quotes               │       │
│  │  ├─ GET /:symbol                → Single symbol data              │       │
│  │  ├─ GET /history/:symbol        → OHLC history                    │       │
│  │  └─ WebSocket /ws/market        → Live streaming                  │       │
│  │                                                                      │       │
│  │  /api/ai/*                                                        │       │
│  │  ├─ POST /analyze               → Full multi-agent pipeline       │       │
│  │  ├─ GET /analyze/stream         → SSE real-time traces           │       │
│  │  ├─ GET /compare-profiles       → Cross-profile comparison        │       │
│  │  ├─ GET /profiles               → List available profiles         │       │
│  │  ├─ GET /sample-portfolio       → Example portfolio context       │       │
│  │  ├─ GET /status                 → System health check             │       │
│  │  └─ GET /health                 → General health endpoint         │       │
│  │                                                                      │       │
│  └──────────────────────────────────────────────────────────────────────┘       │
│                                                                                 │
│  Stack: Node.js, Express.js 5, TypeScript, WebSocket (ws), Axios              │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                    External API    │
                                    │
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          EXTERNAL DATA SOURCES                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐  │
│  │  Upstox API v3       │  │  LLM Providers       │  │  Vector Store (RAG)  │  │
│  │  - Live Quotes       │  │  - Groq (preferred)  │  │  - Embeddings        │  │
│  │  - OHLC Data         │  │  - OpenAI (fallback) │  │  - Filing Chunks     │  │
│  │  - WebSocket Feed    │  │  - Multi-provider    │  │  - Similarity Search │  │
│  │  - Protobuf Encoding │  │    failover          │  │  - Citation Tracking │  │
│  └──────────────────────┘  └──────────────────────┘  └──────────────────────┘  │
│                                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────┐                            │
│  │  News & Sentiment    │  │  Earnings Calls      │                            │
│  │  - News Aggregator   │  │  - Transcript API    │                            │
│  │  - Sentiment Scores  │  │  - Speaker Identity  │                            │
│  │  - Social Media      │  │  - Q&A Sections      │                            │
│  └──────────────────────┘  └──────────────────────┘                            │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                           DATA FLOW EXAMPLE                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  USER INTERACTION:                                                             │
│  1. User selects "RELIANCE" in stock picker                                    │
│  2. User selects profile: "User A (Conservative)"                              │
│  3. Frontend calls: POST /api/ai/analyze                                       │
│     {                                                                          │
│       "symbol": "RELIANCE",                                                    │
│       "profileId": "user_a_conservative"                                       │
│     }                                                                          │
│                                                                                 │
│  BACKEND PROCESSING:                                                          │
│  1. AIController.analyze() called                                              │
│  2. MarketService.getComprehensive("RELIANCE")                                 │
│     → Returns: Price 1420.50, RSI 62.4, MACD +4.4, MA20 1395.00, etc.         │
│                                                                                 │
│  3. AgentOrchestrator.executeParallel("RELIANCE") [PARALLEL EXECUTION]         │
│     ├─ Technical Agent: Analyzes RSI + MACD + Volume → BULLISH 82%            │
│     ├─ Fundamental Agent: Queries RAG for Q1 filings → BULLISH 79%            │
│     ├─ Sentiment Agent: Parses news & calls → POSITIVE 71%                    │
│     └─ Total latency: max(1.2s, 1.8s, 1.4s) = 1.8s                            │
│                                                                                 │
│  4. SynthesisAgent.synthesize([Tech, Fund, Sent])                              │
│     → Consensus: BULLISH                                                      │
│     → Confidence: (82% + 79% + 71%) / 3 = 76%                                 │
│     → Conflict: NONE                                                          │
│                                                                                 │
│  5. PersonalizationEngine.personalize(Synthesis, UserAProfile, RELIANCE)       │
│     → User A is Conservative + already owns 30% RELIANCE                       │
│     → Recommendation: SMALL_ADD (risk-adjusted from CONSIDER_BUY)             │
│     → Explanation: "Bullish signals present but existing concentration is      │
│         high. Capital allocation capped to prevent risk concentration."        │
│                                                                                 │
│  6. RecommendationEngine.assembleRecommendation(...)                           │
│     → Final output:                                                           │
│     {                                                                          │
│       "action": "SMALL_ADD",                                                   │
│       "overallConfidence": 76,                                                 │
│       "summary": "Market BULLISH but your portfolio concentration risk...",    │
│       "reasons": [...],                                                        │
│       "synthesis": {...},                                                      │
│       "personalization": {...},                                                │
│       "sources": [{page: 12, snippet: "..."}],                                │
│       "traces": [...],                                                         │
│       "metadata": {totalLatencyMs: 4500}                                        │
│     }                                                                          │
│                                                                                 │
│  7. Response sent back to frontend + rendered in UI                            │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                      REAL-TIME SSE STREAMING (ALTERNATIVE)                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Frontend: GET /api/ai/analyze/stream?symbol=RELIANCE                          │
│                                                                                 │
│  Backend streams events in real-time:                                          │
│                                                                                 │
│  event: INIT                                                                   │
│  data: {"symbol": "RELIANCE", "profileId": "moderate", "timestamp": "..."}    │
│                                                                                 │
│  event: TRACE                                                                  │
│  data: {                                                                       │
│    "eventType": "TECHNICAL_AGENT_STARTED",                                    │
│    "agent": "Technical",                                                      │
│    "status": "RUNNING",                                                       │
│    "message": "Analyzing price action..."                                     │
│  }                                                                             │
│                                                                                 │
│  event: TRACE                                                                  │
│  data: {                                                                       │
│    "eventType": "TECHNICAL_AGENT_COMPLETED",                                  │
│    "agent": "Technical",                                                      │
│    "status": "COMPLETED",                                                     │
│    "message": "Signal: BULLISH (82%)",                                        │
│    "latencyMs": 1200,                                                         │
│    "metadata": {"rsi": 62.4, "macdSignal": "BULLISH_CROSSOVER"}              │
│  }                                                                             │
│                                                                                 │
│  [... more TRACE events for Fundamental, Sentiment, Synthesis ...]           │
│                                                                                 │
│  event: RECOMMENDATION                                                        │
│  data: {full recommendation object}                                           │
│                                                                                 │
│  event: DONE                                                                   │
│  data: {"message": "Analysis complete", "totalLatencyMs": 4500}               │
│                                                                                 │
│  Frontend subscribes to EventSource and updates UI in real-time                │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

KEY ARCHITECTURAL PRINCIPLES:

1. SEPARATION OF CONCERNS
   - Market Data Layer (quotes, symbols) ← isolated from AI logic
   - AI Agents (independent, replaceable) ← each can be swapped/mocked
   - Personalization Layer (user context) ← applied after consensus

2. PARALLEL EXECUTION
   - Agents 1-3 run in Promise.allSettled() for maximum throughput
   - Risk & Synthesis agents sequential (depend on prior results)
   - Total latency: ~4.5s (not 7.4s serial) due to parallelism

3. GRACEFUL DEGRADATION
   - If Sentiment Agent unavailable → confidence reduced, decision still made
   - If News Feed down → falls back to Technical + Fundamental only
   - If LLM unavailable → fallback to mock responses (demo mode)

4. OBSERVABILITY
   - Real-time SSE traces for Glass Box transparency
   - Per-agent latency measurement
   - Conflict detection & logging
   - Complete citation trail for every claim

5. PERSONALIZATION AS FINAL LAYER
   - Market view (consensus) stays consistent across users
   - Personalization applies AFTER synthesis
   - Different portfolios & profiles → different actions from same data
   - Portfolio concentration score (0-100) drives decision modulation
```

---

## 🎯 Summary

**FinsightAI** is a sophisticated **multi-agent autonomous financial intelligence platform** that revolutionizes investment decision-making through:

1. **Parallel Multi-Agent Architecture**: Five specialized agents (Technical, Fundamental, Sentiment, Risk, Synthesis) execute in parallel to analyze stocks from every angle
2. **Dynamic Personalization**: Same market view yields different recommendations based on individual portfolio context and risk tolerance
3. **RAG-Enhanced Fundamentals**: Vector store lookups + LLM synthesis deliver page-level citations from statutory filings
4. **Real-Time Transparency**: Server-Sent Events streaming shows every step of the analysis pipeline
5. **Graceful Fault Handling**: Signal conflicts, missing data, and component failures trigger automatic confidence dampening
6. **Modern UI/UX**: Dark space aesthetic with interactive 3D visualizations and glassmorphic components

The project is production-ready for educational use, hackathon evaluation, and serves as a blueprint for building AI-driven fintech applications at scale.