# FinSight AI — Autonomous Financial Intelligence Platform

> **Tagline**: *"From Market Data to Personalized Intelligence."*

FinSight AI is a **multi-agent autonomous AI system for retail investors**. It bridges the gap between raw data availability and decision intelligence by executing specialized parallel AI agents (Technical, Fundamental RAG, Sentiment, Risk/Personalization, and Synthesis) to convert price feeds, statutory filings, and news signals into explainable, personalized, evidence-backed investment intelligence.

---

## 🌟 Core Product Differentiator

### `SAME STOCK + SAME MARKET DATA + DIFFERENT USER = DIFFERENT DECISION`

The market view remains identical, but the recommendation adapts dynamically based on the investor's portfolio concentration and risk tolerance:

- **User A (Conservative, 30% Existing Exposure)**:
  - *Market View*: **`🟢 BULLISH (76%)`**
  - *Personalized Recommendation*: **`🟡 SMALL ADD`**
  - *Reasoning*: Positive technical & filing signals present, but existing concentration is already high (30%). Capital allocation is capped to prevent concentration risk.

- **User B (Aggressive, 5% Existing Exposure)**:
  - *Market View*: **`🟢 BULLISH (76%)`**
  - *Personalized Recommendation*: **`🟢 CONSIDER BUY`**
  - *Reasoning*: Strong bullish signals with low existing exposure (5%) allow taking full advantage of growth momentum.

---

## 🎨 Visual Theme & Interactive 3D Features

Styled after modern web3/fintech aesthetics (Mecha Pay aesthetic):
- **Ultra-Dark Space Background (`#050508`)**: Pitch dark background with blue/cyan top radial spotlight mesh glows.
- **Capsule Pills & Glass Cards**: Rounded pill buttons, micro-caps status badges (`Institutional Engine v1.0`), and dark glassmorphic cards (`border-white/10`).
- **Interactive 3D Graphics**:
  - **Floating 3D Financial Cards**: Glassmorphic 3D cards with mouse parallax tilt physics (3D Technical Analyst Token, 3D RAG Filing Document Card, 3D Risk Shield).
  - **Interactive 3D Multi-Agent Node Network**: WebGL dynamic node mesh visualizer showcasing parallel data flows between agents.

---

## 🤖 Multi-Agent Architecture

```text
                    USER QUERY
                        │
                        ▼
                 ORCHESTRATOR
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
     TECHNICAL      FUNDAMENTAL    SENTIMENT
       AGENT           AGENT         AGENT
   (Price/MACD)    (RAG Filings)  (News/Calls)
          │             │             │
          └─────────────┼─────────────┘
                        ▼
                   RISK AGENT
               (Portfolio Shield)
                        │
                        ▼
                 SYNTHESIS AGENT
            (Personalized Decision)
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
  Recommendation   Explanation     Citations
```

1. **Agent 1 — Technical Analyst**: Price action, volume ratios, RSI momentum, and MACD crossovers.
2. **Agent 2 — Fundamental Analyst (RAG)**: Retrieves statutory quarterly reports from vector storage with page-level citations.
3. **Agent 3 — Sentiment Analyst**: Parses news sentiment and earnings call commentary.
4. **Agent 4 — Risk / Personalization Engine**: Evaluates concentration score (0-100) and portfolio exposure.
5. **Agent 5 — Synthesis Agent**: Merges agent signals and user context into a final personalized recommendation.

---

## 🛠 Project Structure

```text
e:/projects/FinsightAI/
├── backend/                  # Express + TypeScript Backend
│   ├── src/
│   │   ├── market/           # Upstox market feed, websocket broadcaster, symbol registry
│   │   ├── server.ts         # Express API Server (Port 5000)
│   │   └── app.ts
├── frontend/                 # Next.js 16 + Tailwind CSS v4 Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx      # Main Landing Hero & Intelligence Dashboard
│   │   │   └── globals.css   # Dark space visual tokens & glass utilities
│   │   ├── components/
│   │   │   ├── 3d/           # Interactive 3D floating cards & node mesh visualizers
│   │   │   ├── landing/      # Mecha Pay style Landing Hero & Feature Grid
│   │   │   └── dashboard/    # StockSelector, SynthesisCard, AgentCards, ExplainabilityPanel
│   │   ├── services/
│   │   │   └── agent-engine.ts # Multi-Agent Analysis Orchestrator
│   │   └── types/            # TypeScript interfaces
└── README.md
```

---

## 🚀 Quick Start Instructions

### 1. Run the Backend API Server
```bash
cd backend
npm install
npm run dev
```
*Server runs at `http://localhost:5000/health` and `/api/market/...`*

### 2. Run the Next.js Frontend Dashboard
```bash
cd frontend
npm install
npm run dev
```
*Open `http://localhost:3000` in your browser.*

---

## 🧪 Hackathon Demo Flow for Judges

1. **Landing Page**: Open `http://localhost:3000` to inspect the Mecha Pay style hero landing page, interactive 3D floating cards, and 3D agent node mesh. Click **`Launch App ↗`**.
2. **Stock Selection**: Select `RELIANCE` from the stock selector header. Click **`Execute Multi-Agent Analysis`**.
3. **Parallel Agent Execution**: View parallel outputs for Technical (82%), Fundamental (79%), and Sentiment (71%).
4. **Personalization Demo**:
   - Under **User A (Conservative)**, observe Market View: `BULLISH` vs. Personalized Decision: **`SMALL ADD`**.
   - Switch top persona pill to **User B (Aggressive)**. Notice the personalized decision changes to **`CONSIDER BUY`**!
5. **RAG Citations**: Inspect Fundamental Agent citations to view page number (`Page 12`) and extracted statutory text.
6. **Explainability Accordion**: Click *"How did AI reach this decision?"* to review the complete 7-step reasoning chain.
7. **Fault Testing**:
   - Toggle **`Simulate Missing News Data`** to test graceful confidence decay (`76% → 61%`).
   - Toggle **`Simulate Signal Disagreement`** to trigger `⚠ SIGNAL CONFLICT DETECTED` and automatic confidence dampening.

---

## 🛡 AI Safety Disclaimer

> **AI-generated investment intelligence. Not financial advice.**  
> FinSight AI provides automated research synthesis for educational and informational demonstration purposes only.