# FinsightAI — Autonomous Multi-Agent Financial Intelligence Platform

> **From Market Data to Personalized Intelligence**

FinsightAI is an autonomous AI-powered financial intelligence platform for retail investors. It combines live market data, specialized AI agents, RAG-enhanced fundamental analysis, sentiment analysis, portfolio risk, and user personalization to turn raw market information into explainable, context-aware investment intelligence.

> ⚠️ **Disclaimer:** FinsightAI is an educational and informational demonstration, not financial advice. AI-generated analysis may contain errors, data degradation, signal conflicts, or model hallucinations. Investment decisions should be independently verified.

---

## ✨ Why FinsightAI?

Traditional investment platforms often show the same market signals to every investor. FinsightAI separates the **market view** from the **personalized decision**:

**Same stock + same market data + different user context = different decision**

Personalization considers:

- **Portfolio concentration** — existing exposure to the stock
- **Risk tolerance** — conservative, moderate, or aggressive
- **Investment horizon** — short-term vs. long-term objectives
- **Signal conflicts** — disagreement between agents automatically reduces confidence

### Example

| | User A — Conservative | User B — Aggressive |
|---|---|---|
| Market View | 🟢 BULLISH (76%) | 🟢 BULLISH (76%) |
| Existing RELIANCE Exposure | 30% | 5% |
| Personalized Decision | 🟡 **SMALL ADD** | 🟢 **CONSIDER BUY** |
| Rationale | Concentration risk limits additional allocation | Lower exposure allows greater opportunity capture |

---

## 🧠 Core Features

- 🤖 **Multi-agent stock analysis** across technical, fundamental, and sentiment dimensions
- ⚡ **Parallel agent execution** using `Promise.allSettled()`
- 📰 **Sentiment intelligence** from news and earnings-call information
- 📚 **RAG-enhanced fundamental analysis** with filing citations
- 🎯 **Portfolio-aware personalization** based on exposure and risk profile
- 🔀 **Signal conflict detection** with confidence dampening
- 🔎 **Explainable AI** with agent traces, reasons, citations, and metadata
- 📡 **Real-time SSE streaming** for live analysis progress
- 📈 **Live market data** through the Upstox V3 ecosystem with Protobuf support
- 🛡️ **Graceful degradation** when individual data or AI providers are unavailable
- 🎨 **Modern financial dashboard** with glassmorphism and interactive 3D visualizations
- 🧪 **Fault-injection demo controls** for testing missing data and conflicting signals

---

## 🏗️ Architecture

```text
                         ┌─────────────────────┐
                         │      User Query     │
                         │  "Analyze RELIANCE" │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    Orchestrator     │
                         └──────────┬──────────┘
                                    │
                  ┌─────────────────┼─────────────────┐
                  │                 │                 │
                  ▼                 ▼                 ▼
           ┌────────────┐    ┌────────────┐    ┌────────────┐
           │ Technical  │    │ Fundamental│    │ Sentiment  │
           │   Agent    │    │   Agent    │    │   Agent    │
           └─────┬──────┘    └─────┬──────┘    └─────┬──────┘
                 │                 │                 │
                 └─────────────────┼─────────────────┘
                                   ▼
                         ┌─────────────────────┐
                         │   Synthesis Agent   │
                         │ Consensus + Conflict│
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Risk & Personalizer │
                         │ Portfolio + Profile│
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Recommendation      │
                         │ Action + Reasons    │
                         │ Sources + Traces    │
                         └─────────────────────┘
```

### Agent responsibilities

| Agent | Responsibility | Typical output |
|---|---|---|
| **Technical Agent** | Price action, RSI, MACD, moving averages, volume | Signal + confidence + reasons |
| **Fundamental Agent** | Filing retrieval, financial metrics, management guidance | Signal + citations |
| **Sentiment Agent** | News and earnings-call sentiment | Signal + sentiment rationale |
| **Risk Agent** | Portfolio concentration and profile-based risk | Risk score + allocation constraints |
| **Synthesis Agent** | Reconcile agent outputs and detect conflicts | Consensus + confidence |

The first three analytical agents run concurrently. Risk and synthesis operate after the required upstream results are available.

---

## 🛠️ Technology Stack

### Frontend

- **Next.js 16**
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Three.js**
- **Framer Motion**

### Backend

- **Node.js**
- **Express.js 5**
- **TypeScript**
- **WebSocket (`ws`)**
- **Axios**
- **Server-Sent Events (SSE)**

### AI & Data

- **Groq** — preferred LLM provider
- **OpenAI API** — fallback LLM provider
- **Upstox V3** — market data
- **Protobuf** — binary market-feed decoding
- **Vector store** — filing retrieval for RAG
- **News / earnings-call sources** — sentiment analysis

---

## 📁 Project Structure

```text
FinsightAI/
├── backend/
│   ├── src/
│   │   ├── server.ts
│   │   ├── app.ts
│   │   ├── market/
│   │   │   ├── market.service.ts
│   │   │   ├── market.controller.ts
│   │   │   ├── market.routes.ts
│   │   │   ├── market.data.ts
│   │   │   ├── symbol-registry.ts
│   │   │   ├── upstox.ts
│   │   │   ├── types.ts
│   │   │   ├── broadcaster/
│   │   │   ├── providers/
│   │   │   ├── proto/
│   │   │   ├── storage/
│   │   │   └── interfaces/
│   │   └── ai/
│   │       ├── ai.service.ts
│   │       ├── ai.controller.ts
│   │       ├── ai.routes.ts
│   │       ├── agents/
│   │       │   ├── base.agent.ts
│   │       │   ├── technical.agent.ts
│   │       │   ├── fundamentals.agent.ts
│   │       │   └── sentiment.agent.ts
│   │       ├── orchestration/
│   │       │   ├── agent.orchestrator.ts
│   │       │   └── trace.emitter.ts
│   │       ├── synthesis/
│   │       │   └── synthesis.agent.ts
│   │       ├── rag/
│   │       │   └── vector.store.ts
│   │       ├── personalization/
│   │       │   ├── personalization.engine.ts
│   │       │   └── portfolio.analyzer.ts
│   │       ├── recommendation/
│   │       │   └── recommendation.engine.ts
│   │       ├── llm/
│   │       │   └── llm.client.ts
│   │       └── types/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── tests/
│       └── ai-integration.test.ts
│
└── frontend/
    ├── src/
    │   ├── app/
    │   ├── components/
    │   │   ├── 3d/
    │   │   ├── landing/
    │   │   ├── dashboard/
    │   │   ├── analysis/
    │   │   ├── navigation/
    │   │   ├── onboarding/
    │   │   └── watchlist/
    │   ├── services/
    │   ├── types/
    │   └── public/
    ├── package.json
    ├── tsconfig.json
    ├── next.config.ts
    ├── postcss.config.mjs
    └── tailwind.config.ts
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js **18+**
- npm
- Upstox API credentials for live market data
- Groq and/or OpenAI API credentials for LLM functionality

> Demo/mock fallbacks are available when optional external providers are unavailable.

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd FinsightAI
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure backend environment

Create `backend/.env`:

```env
PORT=5000

UPSTOX_API_KEY=your_upstox_key_here
GROQ_API_KEY=your_groq_key_here
OPENAI_API_KEY=your_openai_key_here
```

### 4. Start the backend

```bash
npm run dev
```

The backend exposes:

```text
REST API       http://localhost:5000
Market API     http://localhost:5000/api/market
AI API         http://localhost:5000/api/ai
Market WS      ws://localhost:5000/ws/market
```

### 5. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

### 6. Configure frontend environment

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 7. Start the frontend

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 📡 API Reference

### Market Data

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/market/quotes` | Fetch cached symbol quotes |
| `GET` | `/api/market/:symbol` | Fetch comprehensive symbol data |
| `GET` | `/api/market/history/:symbol` | Fetch OHLC history |
| `WS` | `/ws/market` | Stream live market updates |

### AI Analysis

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ai/analyze` | Run the complete multi-agent pipeline |
| `GET` | `/api/ai/analyze/stream?symbol=RELIANCE` | Stream agent traces through SSE |
| `GET` | `/api/ai/compare-profiles?symbol=RELIANCE` | Compare decisions across profiles |
| `GET` | `/api/ai/profiles` | List available user profiles |
| `GET` | `/api/ai/sample-portfolio` | Retrieve sample portfolio context |
| `GET` | `/api/ai/status` | Check AI subsystem health and provider status |

### Example analysis request

```json
{
  "symbol": "RELIANCE",
  "profileId": "conservative",
  "simulateFailure": false
}
```

---

## 🔄 Analysis Pipeline

For a request such as:

```text
Analyze RELIANCE
```

FinsightAI follows this flow:

1. **Retrieve market context**
   - Price
   - RSI
   - MACD
   - Moving averages
   - Volume
   - Historical information

2. **Run specialized agents in parallel**
   - Technical
   - Fundamental
   - Sentiment

3. **Synthesize signals**
   - Calculate consensus
   - Detect disagreement
   - Damp confidence when conflicts exist

4. **Evaluate portfolio risk**
   - Existing exposure
   - Concentration score
   - User risk profile
   - Sector-related risk

5. **Personalize the decision**
   - Apply user-specific context after market synthesis

6. **Assemble the recommendation**
   - Action
   - Confidence
   - Explanation
   - Sources
   - Agent traces
   - Performance metadata

This architecture keeps the **market view consistent** while allowing the **final decision to adapt to the investor**.

---

## 🔎 Explainability & Observability

FinsightAI is designed as a **glass-box** system rather than a black box.

The platform exposes:

- Real-time agent execution traces
- Per-agent latency
- Agent confidence scores
- Signal conflicts
- RAG source citations
- Reasoning steps
- Recommendation metadata
- Failure/degradation states

The SSE endpoint can stream events such as:

```text
INIT
TECHNICAL_AGENT_STARTED
TECHNICAL_AGENT_COMPLETED
FUNDAMENTAL_AGENT_STARTED
FUNDAMENTAL_AGENT_COMPLETED
SENTIMENT_AGENT_STARTED
SENTIMENT_AGENT_COMPLETED
SYNTHESIS_COMPLETED
RECOMMENDATION
DONE
```

---

## 🛡️ Fault Tolerance

The system is designed to continue operating when individual components fail.

### Missing sentiment/news data

```text
Sentiment unavailable
        ↓
Technical + Fundamental continue
        ↓
Overall confidence reduced
        ↓
Recommendation remains available
```

### Conflicting signals

```text
Technical → BULLISH
Fundamental → BULLISH
Sentiment → BEARISH
        ↓
Conflict detected
        ↓
Confidence dampened
        ↓
More conservative recommendation
```

### LLM provider failure

The architecture supports a Groq/OpenAI provider abstraction and demo/mock fallback behavior when configured providers are unavailable.

---

## 🎨 Frontend Experience

The dashboard uses a dark, space-inspired financial interface with:

- Glassmorphic cards
- Cyan/blue accents
- Amber highlights
- Financial-data typography
- Framer Motion transitions
- Interactive 3D cards
- WebGL agent-node visualization

### Main views

1. **Dashboard** — market summary, sector heatmap, and top stories
2. **Analysis** — multi-agent results, synthesis, and explainability
3. **Heatmap** — sector rotation visualization
4. **Watchlist** — curated stocks and alerts
5. **News Feed** — market intelligence and sentiment
6. **Personalization** — risk-profile onboarding

---

## 🧪 Hackathon Demo Flow

The recommended demonstration is:

### 1. Launch

Open:

```text
http://localhost:3000
```

Show the landing page and interactive 3D experience.

### 2. Explore the dashboard

Review:

- Market summary
- Sector heatmap
- Top stories
- Stock selector

### 3. Run multi-agent analysis

Select:

```text
RELIANCE
```

Then run:

```text
Re-Run Multi-Agent Engine
```

Show the technical, fundamental, and sentiment agents executing.

### 4. Demonstrate personalization

Start with:

```text
User A — Conservative
```

Then switch to:

```text
User B — Aggressive
```

Demonstrate that the **market view remains the same**, while the personalized decision changes.

### 5. Demonstrate explainability

Open:

- Fundamental Agent citations
- Source snippets
- "How did AI reach this decision?"
- Agent trace timeline

### 6. Demonstrate fault tolerance

Use the demo controls to simulate:

- Missing news data
- Signal disagreement

Show how the system reduces confidence and becomes more conservative.

### 7. Show performance telemetry

Highlight:

- Total analysis latency
- Individual agent latency
- Confidence
- Execution traces

---

## 🧑‍💻 Development & Testing

### Backend tests

```bash
cd backend
npm run test:ai
```

### Frontend production build

```bash
cd frontend
npm run build
npm start
```

### Frontend linting

```bash
cd frontend
npm run lint
```

---

## 🔐 Environment Variables

### Backend — `backend/.env`

```env
PORT=5000
UPSTOX_API_KEY=xxx
GROQ_API_KEY=xxx
OPENAI_API_KEY=xxx
```

### Frontend — `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Never commit real API keys or secrets to Git.**

---

## 📊 Performance Model

The first three analysis agents execute concurrently:

```text
Technical       ~1.2s
Fundamental     ~1.8s
Sentiment       ~1.4s
                 │
                 └── Parallel execution
                     ≈ max(1.2, 1.8, 1.4)
                     ≈ 1.8s
```

This avoids the full serial execution cost and allows the system to provide a faster analysis pipeline.

---

## 🗺️ Roadmap

- [ ] Persistent PostgreSQL storage for historical agent traces
- [ ] Production-grade Upstox WebSocket + Protobuf integration
- [ ] Institutional-grade RAG using LangChain/LlamaIndex
- [ ] Portfolio optimization using Markowitz frontier analysis
- [ ] Real-time concentration and signal-conflict alerts
- [ ] React Native mobile application
- [ ] Multi-asset support for crypto, forex, and commodities

---

## 📚 Documentation

Additional project documentation is available in:

```text
/docs
```

Related resources include:

- Architecture specifications
- Agent behavior documentation
- API documentation
- Swagger/OpenAPI documentation when enabled

---

## 🤝 Contributing

This project was built for **Hackverse 2026**.

Contributions, bug reports, and feature suggestions are welcome.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Commit your changes
6. Open a pull request

---

## 📄 License

This project is released under the **ISC License**.

See [`LICENSE`](LICENSE) for details.

---

## 👨‍💻 Author

**Hari Aswath** — [@HariAswath](https://github.com/HariAswath)

---

## 💬 Support

For issues or questions:

1. Check existing GitHub issues
2. Review the `/docs` directory
3. Open a new issue with detailed reproduction steps

---

<div align="center">

### FinsightAI

**Autonomous Financial Intelligence for Retail Investors**

*From Market Data to Personalized Intelligence*

</div>
