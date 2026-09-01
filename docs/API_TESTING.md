# FinsightAI API Testing Guide

This guide provides test cases, `curl` commands, PowerShell examples, and expected responses for manually verifying the **FinsightAI Backend** and the **Multi-Agent Autonomous Financial Intelligence AI Subsystem**.

---

## 1. Quick Start / Prerequisites

Ensure the backend server is running:

```powershell
cd backend
npm run dev
```

* **Server Port**: `http://localhost:5000`
* **WebSocket Stream**: `ws://localhost:5000/ws/market`
* **Automated Test Suite**:
  ```powershell
  npm run test:ai
  ```

---

## 2. Test Case Matrix

| ID | Category | Method | Endpoint | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Health | `GET` | `/health` | Verify server uptime and responsiveness |
| **TC-02** | Market Data | `GET` | `/api/market/RELIANCE` | Verify existing live market feed & quotes |
| **TC-03** | AI Status | `GET` | `/api/ai/status` | Verify multi-agent availability & LLM engine |
| **TC-04** | User Profiles | `GET` | `/api/ai/profiles` | Inspect preset risk profiles |
| **TC-05** | Portfolio | `GET` | `/api/ai/portfolio/sample` | Inspect sample portfolio & holdings |
| **TC-06** | AI Analysis | `POST` | `/api/ai/analyze` | Run full 3-agent parallel analysis (Moderate) |
| **TC-07** | Personalization | `POST` | `/api/ai/compare-profiles` | Compare Conservative vs Moderate vs Aggressive |
| **TC-08** | Fault Tolerance | `POST` | `/api/ai/analyze` | Test Graceful Degradation (Sentiment feed offline) |
| **TC-09** | Glass Box SSE | `GET` | `/api/ai/analyze/stream` | Stream real-time agent trace events |

---

## 3. Detailed Test Cases

### TC-01: Health Check
Verify that the Express server is operational.

#### cURL
```bash
curl -X GET http://localhost:5000/health
```

#### PowerShell
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/health" -Method Get
```

#### Expected Output
```json
{
  "status": "ok",
  "service": "FinsightAI Backend",
  "timestamp": "2026-09-01T..."
}
```

---

### TC-02: Existing Market Quote (RELIANCE)
Verify that existing market quotes and technical feeds remain untouched and functional.

#### cURL
```bash
curl -X GET http://localhost:5000/api/market/RELIANCE
```

#### Expected Output (Snippet)
```json
{
  "success": true,
  "data": {
    "quote": {
      "symbol": "RELIANCE",
      "ltp": 2985.4,
      "change": 35.4,
      "changePercent": 1.2
    },
    "comprehensive": {
      "companyName": "Reliance Industries Ltd.",
      "sector": "Oil, Gas & Consumer Conglomerate",
      "peRatio": 28.4
    }
  }
}
```

---

### TC-03: AI Subsystem Status
Check the status of the multi-agent system, active LLM provider (Groq/OpenAI or offline fallback), and agent readiness.

#### cURL
```bash
curl -X GET http://localhost:5000/api/ai/status
```

#### Expected Output
```json
{
  "service": "FinsightAI Multi-Agent Subsystem",
  "status": "operational",
  "provider": "Groq (llama-3.3-70b-versatile)",
  "hasActiveKey": true,
  "groqConfigured": true,
  "openaiConfigured": false,
  "agentsAvailable": [
    "Fundamentals",
    "Technical",
    "Sentiment"
  ],
  "orchestration": "Parallel (Promise.allSettled)",
  "supportedProfiles": [
    "conservative",
    "moderate",
    "aggressive"
  ]
}
```

---

### TC-04: Preset Risk Profiles
View available user profiles (`conservative`, `moderate`, `aggressive`) with concentration limits.

#### cURL
```bash
curl -X GET http://localhost:5000/api/ai/profiles
```

#### Expected Output (Snippet)
```json
{
  "profiles": {
    "conservative": {
      "riskTolerance": "CONSERVATIVE",
      "horizon": "LONG_TERM",
      "maxStockConcentrationPct": 10
    },
    "moderate": {
      "riskTolerance": "MODERATE",
      "horizon": "MEDIUM_TERM",
      "maxStockConcentrationPct": 15
    },
    "aggressive": {
      "riskTolerance": "AGGRESSIVE",
      "horizon": "SHORT_TERM",
      "maxStockConcentrationPct": 25
    }
  }
}
```

---

### TC-05: Sample Portfolio & Holdings
Fetch sample holdings to test deterministic concentration checks.

#### cURL
```bash
curl -X GET http://localhost:5000/api/ai/portfolio/sample
```

#### Expected Output (Snippet)
```json
{
  "portfolio": {
    "totalPortfolioValue": 1640000,
    "cashBalance": 758540,
    "holdings": [
      { "symbol": "RELIANCE", "weightPct": 18.2, "sector": "Oil, Gas & Consumer Conglomerate" },
      { "symbol": "HDFCBANK", "weightPct": 15.1, "sector": "Banking & Financial Services" }
    ]
  }
}
```

---

### TC-06: Full Multi-Agent Analysis (Moderate Profile)
Execute parallel analysis with `FundamentalsAgent`, `TechnicalAgent`, and `SentimentAgent`.

#### cURL
```bash
curl -X POST http://localhost:5000/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{"symbol": "RELIANCE", "profileId": "moderate"}'
```

#### PowerShell
```powershell
$body = @{
  symbol = "RELIANCE"
  profileId = "moderate"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/ai/analyze" -Method Post -Body $body -ContentType "application/json"
```

#### Key Fields to Verify in Response:
- `action`: `'BUY' | 'ACCUMULATE' | 'HOLD' | 'REDUCE' | 'AVOID'`
- `overallConfidence`: Number between 0 and 100
- `executiveSummary`: Natural language thesis
- `agents.Fundamentals`: Signal, confidence, and cited SEBI filings
- `agents.Technical`: Pre-calculated indicators (RSI, MACD, EMAs)
- `agents.Sentiment`: Market narrative and tone analysis
- `synthesis.conflict`: Signal conflict matrix (e.g. `severity: "NONE" | "MILD" | "SHARP"`)
- `personalization`: Profile modulation
- `portfolioRisk`: Concentration limit checks
- `citations`: Ranked array of grounded evidence

---

### TC-07: Personalization Demo (Section 22 & 38 Demo)
Demonstrate that the same stock and identical market data yield distinct personalized actions for Conservative, Moderate, and Aggressive profiles.

#### cURL
```bash
curl -X POST http://localhost:5000/api/ai/compare-profiles \
  -H "Content-Type: application/json" \
  -d '{"symbol": "RELIANCE"}'
```

#### PowerShell
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/ai/compare-profiles" -Method Post -Body '{"symbol":"RELIANCE"}' -ContentType "application/json"
```

#### Expected Output Structure:
```json
{
  "symbol": "RELIANCE",
  "consensusSignal": "BULLISH",
  "profiles": [
    {
      "riskTolerance": "CONSERVATIVE",
      "action": "HOLD",
      "explanation": "Conservative Profile: High valuation or required margin of safety throttles action to HOLD..."
    },
    {
      "riskTolerance": "MODERATE",
      "action": "ACCUMULATE",
      "explanation": "Moderate Profile: Balanced signals favor progressive accumulation..."
    },
    {
      "riskTolerance": "AGGRESSIVE",
      "action": "BUY",
      "explanation": "Aggressive Profile: Strong momentum indicators trigger an active BUY directive..."
    }
  ]
}
```

---

### TC-08: Graceful Degradation / Fault Tolerance (Section 39 Demo)
Simulate an external data feed failure (e.g., Sentiment feed goes offline) and observe how the system continues without hallucinating.

#### cURL
```bash
curl -X POST http://localhost:5000/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{"symbol": "RELIANCE", "simulateFailure": "sentiment"}'
```

#### Key Fields to Verify:
1. `agents.Sentiment.status` is `"unavailable"` (with `confidence: 0` and clear limitation note).
2. `synthesis.dataCompleteness.degradedWarning` explicitly informs the user:
   > *"Sentiment data feed unavailable. Recommendation generated using available dimensions with reduced confidence penalty."*
3. The pipeline finishes successfully without throwing a 500 error.

---

### TC-09: Live Glass Box Real-Time Event Stream (SSE)
Stream real-time trace events for the Glass Box UI as each agent progresses and completes.

#### cURL
```bash
curl -N -X GET "http://localhost:5000/api/ai/analyze/stream?symbol=TCS&profileId=aggressive"
```

#### In Browser
Open:
`http://localhost:5000/api/ai/analyze/stream?symbol=TCS&profileId=aggressive`

#### Expected Output Stream:
```text
event: INIT
data: {"symbol":"TCS","profileId":"aggressive","timestamp":"..."}

event: TRACE
data: {"step":"ANALYSIS_STARTED","status":"RUNNING","message":"Initiating multi-agent parallel analysis..."}

event: TRACE
data: {"step":"AGENT_STARTED","agent":"Fundamentals","status":"RUNNING"}

event: TRACE
data: {"step":"AGENT_STARTED","agent":"Technical","status":"RUNNING"}

event: TRACE
data: {"step":"AGENT_COMPLETED","agent":"Technical","status":"COMPLETED","data":{"signal":"BULLISH","confidence":0.89}}

event: TRACE
data: {"step":"SYNTHESIS_STARTED","status":"RUNNING"}

event: TRACE
data: {"step":"PERSONALIZATION_STARTED","status":"RUNNING"}

event: RECOMMENDATION
data: {"action":"BUY","overallConfidence":88,"executiveSummary":"..."}

event: DONE
data: {"message":"Analysis complete","totalLatencyMs":18}
```
