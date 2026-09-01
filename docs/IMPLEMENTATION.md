# IMPLEMENTATION.md

> **Status: Living Implementation Document**
>
> This document describes the **current planned/implemented technical architecture** of the project.
>
> **The actual backend repository structure and implementation are the source of truth.**
>
> As development progresses, the backend architecture, module structure, technologies, APIs, agent implementation, and data flow may change. When this happens, this document must be updated to reflect the actual implementation.
>
> Therefore, this document is **not a rigid specification** and should be considered **prone to change throughout development**.
>
> ### Source of Truth Hierarchy
>
> ```text
> Actual Backend Code
>        ↓
>   Source of Truth
>        ↓
> IMPLEMENTATION.md
>        ↓
> Documentation
> ```
>
> If any discrepancy exists between this document and the repository, **the repository implementation takes precedence**.
>
> The Problem Statement remains the source of truth for **functional requirements**, while the backend implementation is the source of truth for **technical implementation**.

---

# 1. Purpose

This document describes how the Multi-Agent Autonomous Financial Intelligence System is currently implemented.

The system is designed to satisfy the requirements of **PS-01 — Multi-Agent Autonomous Financial Intelligence System for Retail Investors**.

The implementation is based on:

* Next.js
* Express.js
* TypeScript
* OpenAI API
* ChromaDB
* PostgreSQL
* Redis
* WebSockets / Socket.IO

The exact technologies and architecture may change as development progresses.

The goal is to maintain a clean separation between:

```text
Functional Requirements
        ↓
System Architecture
        ↓
Backend Implementation
        ↓
Frontend Implementation
```

---

# 2. Implementation Philosophy

The project is intentionally built as a **TypeScript-first system**.

The AI functionality is implemented in TypeScript rather than introducing a separate Python AI service.

The initial architecture follows:

```text
Next.js
   ↓
Express
   ↓
AI Orchestrator
   ↓
Specialized Agents
   ↓
Synthesis
   ↓
Personalization
   ↓
Recommendation
```

This structure is expected to evolve as the implementation develops.

---

# 3. Current Technology Stack

## Frontend

```text
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
Recharts
Socket.IO Client
```

## Backend

```text
Node.js
Express.js
TypeScript
Socket.IO
Zod
```

## AI

```text
OpenAI API
OpenAI Embeddings
Custom TypeScript Agent Orchestration
```

## RAG

```text
ChromaDB
Embeddings
Semantic Retrieval
Document Chunking
```

## Persistence

```text
PostgreSQL
Prisma
```

## Cache / Realtime State

```text
Redis
```

---

# 4. Repository Architecture

The repository is organized into separate frontend and backend applications.

```text
project/
│
├── frontend/
│
├── backend/
│
├── docker-compose.yml
│
├── .env.example
│
└── README.md
```

The **backend directory is the primary source of truth for backend architecture**.

Its actual directory structure should be consulted before modifying this document.

---

# 5. Backend Architecture

The backend follows a modular architecture.

The intended dependency flow is:

```text
Routes
  ↓
Controllers
  ↓
Services
  ↓
AI / Domain Logic
  ↓
Infrastructure
```

The AI subsystem is kept separate from HTTP-specific code.

Conceptually:

```text
backend/
└── src/
    │
    ├── routes/
    │
    ├── controllers/
    │
    ├── services/
    │
    ├── ai/
    │
    ├── middleware/
    │
    ├── config/
    │
    └── utils/
```

> The exact directory and module names are allowed to change. The repository structure always takes precedence over this documentation.

---

# 6. AI Module

The AI subsystem contains the reasoning components required by the problem statement.

Conceptually:

```text
ai/
│
├── agents/
│
├── orchestration/
│
├── rag/
│
├── prompts/
│
├── schemas/
│
├── profile/
│
└── llm/
```

Responsibilities:

| Module          | Responsibility                  |
| --------------- | ------------------------------- |
| `agents`        | Specialized AI agents           |
| `orchestration` | Parallel execution and workflow |
| `rag`           | Document retrieval              |
| `prompts`       | Agent instructions              |
| `schemas`       | Structured output validation    |
| `profile`       | Personalization logic           |
| `llm`           | LLM provider integration        |

The actual implementation may reorganize these modules if the codebase evolves.

---

# 7. Multi-Agent Architecture

The initial implementation uses three specialized agents:

```text
Fundamentals Agent
Technical Agent
Sentiment Agent
```

They execute independently and in parallel.

```text
                  Analysis Request
                         │
             ┌───────────┼───────────┐
             ↓           ↓           ↓
       Fundamentals   Technical   Sentiment
          Agent         Agent        Agent
             │           │           │
             └───────────┼───────────┘
                         ↓
                   Synthesis Agent
                         ↓
                  Profile Weighting
                         ↓
                  Recommendation
```

The architecture is intentionally simple enough to implement reliably within the hackathon timeframe.

---

# 8. Agent Contract

All specialized agents use a common structured result.

```typescript
interface AgentResult {
  agent: string;

  status:
    | "ok"
    | "degraded"
    | "unavailable";

  signal:
    | "BULLISH"
    | "BEARISH"
    | "NEUTRAL"
    | null;

  confidence: number;

  claim: string | null;

  evidence: Evidence[];

  limitations: string[];
}
```

This provides a consistent interface between:

```text
Agents
   ↓
Orchestrator
   ↓
Synthesis Agent
```

The exact schema may change as the implementation evolves.

---

# 9. Runtime Validation

LLM-generated output is not trusted directly.

The output is validated using Zod or the validation mechanism currently used by the backend.

Conceptually:

```text
LLM Output
    ↓
Schema Validation
    ↓
Valid
    │
    ↓
Agent Result

Invalid
    │
    ↓
Degraded / Error Handling
```

This prevents malformed LLM responses from breaking the orchestration pipeline.

---

# 10. LLM Integration

A centralized LLM client is used.

Conceptually:

```text
AI Agent
   ↓
LLM Client
   ↓
OpenAI API
```

Agents should not independently manage API keys or duplicate provider configuration.

Environment configuration is centralized.

---

# 11. Fundamentals Agent

The Fundamentals Agent is responsible for financial-document-based analysis.

It uses RAG to retrieve relevant evidence.

```text
Financial Documents
        ↓
Document Processing
        ↓
Chunking
        ↓
Embeddings
        ↓
ChromaDB
        ↓
Semantic Retrieval
        ↓
Fundamentals Agent
        ↓
Grounded Result
```

The agent should only make financial claims based on available evidence.

---

# 12. ChromaDB

ChromaDB is used as the vector database for the RAG subsystem.

The primary purpose of ChromaDB is:

```text
Store document embeddings
        ↓
Retrieve relevant document chunks
        ↓
Provide context to Fundamentals Agent
```

ChromaDB is **not responsible for**:

* Agent orchestration
* Portfolio calculations
* Risk calculations
* Recommendation persistence
* User management

Those responsibilities belong to their respective backend modules.

---

# 13. Document Metadata

Every document chunk should preserve enough metadata to support attribution.

Conceptually:

```text
symbol
document
document date
page
section
chunk ID
content
embedding
```

Example:

```json
{
  "symbol": "TCS",
  "document": "TCS_Q1_FY27_Earnings",
  "page": 14,
  "section": "Management Commentary"
}
```

This metadata is used to display evidence to the user.

---

# 14. RAG Grounding

The fundamental analysis follows:

```text
Retrieved Evidence
       ↓
LLM Reasoning
       ↓
Fundamental Signal
```

If no relevant evidence is available:

```text
No Evidence
    ↓
No Unsupported Claim
    ↓
DEGRADED / UNAVAILABLE
```

The system should not fabricate financial evidence.

---

# 15. Technical Agent

The Technical Agent evaluates market data.

The implementation separates **financial calculations** from **LLM reasoning**.

Deterministic calculations include:

```text
RSI
MACD
Moving Averages
Momentum
Volume Anomaly
```

The flow is:

```text
Market Data
     ↓
Technical Indicator Engine
     ↓
Calculated Indicators
     ↓
Technical Agent
     ↓
Signal + Explanation
```

The LLM is primarily responsible for interpreting and explaining the calculated indicators rather than performing numerical calculations itself.

---

# 16. Sentiment Agent

The Sentiment Agent analyzes available sentiment information.

Possible inputs include:

```text
Financial News
Company News
Market Narratives
Behavioral Signals
```

The output follows the common agent contract.

If the external sentiment source becomes unavailable, the agent returns a degraded/unavailable state instead of generating unsupported sentiment.

---

# 17. Parallel Agent Execution

The three specialized agents execute concurrently.

Conceptually:

```typescript
const results = await Promise.all([
  runFundamentalsAgent(context),
  runTechnicalAgent(context),
  runSentimentAgent(context)
]);
```

This is important because the problem statement explicitly requires at least three specialized agents executing in parallel.

---

# 18. Synthesis Agent

The Synthesis Agent receives the outputs of the specialized agents.

```text
Fundamentals Result
Technical Result
Sentiment Result
        ↓
Synthesis Agent
```

Responsibilities:

* Compare agent signals
* Identify agreement
* Identify disagreement
* Evaluate confidence
* Combine evidence
* Produce an overall signal
* Explain the reasoning

The Synthesis Agent should not invent evidence.

---

# 19. Conflict Handling

The system explicitly handles conflicting signals.

Example:

```text
Fundamentals → BULLISH
Technical    → BEARISH
Sentiment    → NEUTRAL
```

The synthesis layer identifies the conflict.

The final output should communicate:

```text
Signal Conflict

Fundamentals: Bullish
Technical: Bearish
Sentiment: Neutral

Confidence reduced because
signal dimensions disagree.
```

---

# 20. User Profile

The user profile contains parameters that affect personalization.

Conceptually:

```text
Risk Tolerance
Investment Horizon
Portfolio Exposure
Behavioral Information
```

Example:

```text
Risk:
Conservative / Moderate / Aggressive

Horizon:
Short / Medium / Long
```

The exact profile fields may evolve with the implementation.

---

# 21. Personalization Layer

Personalization is implemented as an explicit layer after synthesis.

```text
Agent Analysis
      ↓
Synthesis
      ↓
Profile Weighting
      ↓
Personalized Recommendation
```

This is important because the PS requires the system to produce different outputs for different user profiles using identical market inputs.

---

# 22. Personalization Demonstration

The system should support a demonstration such as:

```text
             SAME STOCK
                 │
          SAME MARKET DATA
                 │
       ┌─────────┼─────────┐
       ↓         ↓         ↓
 Conservative Moderate Aggressive
       ↓         ↓         ↓
     HOLD     ACCUMULATE     BUY
```

The purpose is to demonstrate that personalization is functional rather than merely included in the UI.

---

# 23. Portfolio Integration

Portfolio information is used as part of personalization.

The system should be able to determine:

```text
Current Holdings
Allocation
Stock Exposure
Sector Exposure
Concentration
```

These calculations should be performed deterministically.

The LLM should not be responsible for calculating portfolio percentages.

---

# 24. Recommendation

The final recommendation combines:

```text
Agent Signals
+
Confidence
+
Evidence
+
Signal Conflicts
+
User Profile
+
Portfolio Exposure
+
Data Availability
```

Possible recommendation states include:

```text
BUY
ACCUMULATE
HOLD
REDUCE
AVOID
```

The final output should contain:

```text
Recommendation
Confidence
Reasoning
Risks
Evidence
Limitations
Personalization Context
```

---

# 25. Agent Trace System

The backend emits events throughout the analysis process.

Example:

```text
analysis.started

fundamentals.started
fundamentals.retrieving
fundamentals.evidence_found
fundamentals.completed

technical.started
technical.completed

sentiment.started
sentiment.completed

synthesis.started
synthesis.completed

profile.started
profile.completed

analysis.completed
```

These events power the Glass Box interface.

---

# 26. Real-Time Communication

Socket.IO is used for real-time communication between Express and Next.js.

```text
AI Orchestrator
      ↓
Agent Events
      ↓
Socket.IO
      ↓
Next.js
      ↓
Glass Box UI
```

The same mechanism can be used for market updates where appropriate.

---

# 27. Glass Box Interface

The frontend exposes the reasoning pipeline to the user.

The UI should show:

```text
Market Signal
     ↓
Fundamentals Agent
     ↓
Technical Agent
     ↓
Sentiment Agent
     ↓
Evidence
     ↓
Synthesis
     ↓
Profile Weighting
     ↓
Final Recommendation
```

Each stage should expose its current status.

---

# 28. Graceful Degradation

The architecture supports:

```text
OK
DEGRADED
UNAVAILABLE
```

Example:

```text
Fundamentals → OK
Technical    → OK
Sentiment    → UNAVAILABLE
```

The system should continue processing.

The final output must clearly state:

```text
Sentiment data unavailable.

Recommendation generated using
Fundamentals + Technical signals.

Confidence reduced due to missing data.
```

The pipeline must not silently replace missing evidence with hallucinated content.

---

# 29. Persistence

PostgreSQL stores persistent application state.

Conceptually:

```text
Users
Profiles
Portfolios
Holdings
Watchlists
Analysis Sessions
Agent Executions
Recommendations
Performance Metrics
```

The exact schema is defined by the current Prisma/database implementation.

The database schema is the source of truth for persistence structure.

---

# 30. Analysis Session

Every analysis should have a session.

Conceptually:

```text
AnalysisSession
----------------
id
userId
symbol
query
startedAt
completedAt
status
signal
confidence
```

Agent executions can then be associated with the session.

This provides an auditable analysis history.

---

# 31. Performance Metrics

The system records at least three measurable session metrics.

Initial metrics:

### Signal Accuracy

```text
Predicted Signal
30-Day Forward Return
Correct / Incorrect
```

### Agent Latency

```text
Agent Start
Agent Completion
Latency
```

### Portfolio Concentration

```text
Stock Exposure
Sector Exposure
Concentration Score
```

The exact metrics may change based on implementation progress.

---

# 32. Redis

Redis is used for short-lived/high-frequency state.

Potential uses:

```text
Market snapshots
Caching
Temporary analysis state
Real-time synchronization
```

PostgreSQL remains the persistent source of truth.

The actual Redis usage may evolve during implementation.

---

# 33. Error Handling

Errors are handled at multiple levels.

```text
External API Error
       ↓
Agent Error Handling
       ↓
Degraded Result
       ↓
Synthesis
       ↓
Final Recommendation
```

The objective is to isolate failures.

For example:

```text
Sentiment API fails
        ↓
Sentiment = UNAVAILABLE
        ↓
Fundamentals + Technical continue
        ↓
Synthesis continues
```

---

# 34. Security

Sensitive configuration must be stored in environment variables.

Example:

```env
OPENAI_API_KEY=
DATABASE_URL=
CHROMA_URL=
REDIS_URL=
JWT_SECRET=
```

Secrets must never be committed to Git.

Authentication and authorization implementation may evolve as the application develops.

---

# 35. Development Strategy

Implementation should proceed in dependency order.

```text
Infrastructure
      ↓
Market Data
      ↓
RAG
      ↓
Agents
      ↓
Orchestration
      ↓
Synthesis
      ↓
Personalization
      ↓
Realtime Traces
      ↓
Metrics
      ↓
UI Polish
```

Do not prioritize visual polish before the end-to-end reasoning pipeline works.

---

# 36. MVP Priority

## P0 — Core System

```text
Three specialized agents
Parallel execution
Structured outputs
RAG
ChromaDB
Citations
Synthesis
User profiling
Personalization
Recommendation
```

## P1 — PS Demonstration

```text
Glass Box
Real-time traces
Portfolio
Watchlist
Graceful degradation
Performance metrics
```

## P2 — Additional Polish

```text
Advanced charts
Animations
Additional indicators
Additional data providers
Broker integrations
```

---

# 37. Demo Flow

The primary demonstration should follow:

```text
1. User selects a stock
          ↓
2. Market data appears
          ↓
3. User profile is loaded
          ↓
4. Three agents start simultaneously
          ↓
5. Fundamentals retrieves financial evidence
          ↓
6. Technical calculates indicators
          ↓
7. Sentiment analyzes available data
          ↓
8. Agent outputs are validated
          ↓
9. Synthesis combines signals
          ↓
10. Conflicts are identified
          ↓
11. User profile is applied
          ↓
12. Personalized recommendation appears
          ↓
13. Evidence and citations are shown
          ↓
14. Full reasoning trace is visible
          ↓
15. Session metrics are stored
```

---

# 38. Personalization Demo

Run the same stock analysis using different profiles.

```text
Market Input
     │
     ├──────── Conservative
     │             ↓
     │            HOLD
     │
     ├──────── Moderate
     │             ↓
     │        ACCUMULATE
     │
     └──────── Aggressive
                   ↓
                  BUY
```

This should be one of the primary judging demonstrations.

---

# 39. Degraded Data Demo

Demonstrate failure of one signal source.

```text
Sentiment Agent
      ↓
UNAVAILABLE
```

The system continues:

```text
Fundamentals → OK
Technical    → OK
Sentiment    → UNAVAILABLE
       ↓
Synthesis
       ↓
Reduced Confidence
       ↓
Cited Recommendation
```

This demonstrates resilience without producing ungrounded output.

---

# 40. Implementation Principles

### 1. Backend is the source of truth

The actual implementation determines the architecture.

### 2. This document is living documentation

Changes to the implementation should be reflected here.

### 3. PS requirements are non-negotiable

Technology choices can change, but required functionality must remain covered.

### 4. Prefer deterministic logic where possible

Use code for:

```text
Financial calculations
Portfolio calculations
Validation
Conflict detection
Profile weighting
```

Use LLMs for:

```text
Interpretation
Reasoning
Natural-language explanation
Evidence synthesis
```

### 5. Evidence must remain traceable

RAG outputs must preserve their source metadata.

### 6. Missing data must be explicit

Never silently fabricate unavailable information.

### 7. Agents should remain independently replaceable

Each specialized agent should follow a clear contract.

---

# 41. Change Policy

Because this is a hackathon project, the architecture is expected to evolve.

Changes may include:

```text
Agent implementation
Folder structure
Database schema
API structure
LLM provider
Vector database
Realtime implementation
Market data provider
Authentication
```

When implementation changes:

```text
1. Update backend code
2. Verify functionality
3. Update IMPLEMENTATION.md
4. Update README if user-facing behavior changed
```

Do not modify working backend code merely to match an outdated version of this document.

---

# 42. Final Source-of-Truth Statement

```text
┌─────────────────────────────────────────┐
│          PROBLEM STATEMENT              │
│                                         │
│ Functional requirements                 │
│ What the system MUST accomplish         │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│          BACKEND IMPLEMENTATION         │
│                                         │
│ Actual architecture + source code       │
│ TECHNICAL SOURCE OF TRUTH               │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│         IMPLEMENTATION.md               │
│                                         │
│ Living documentation of implementation  │
│ PRONE TO CHANGE                         │
└─────────────────────────────────────────┘
```

**The Problem Statement is the source of truth for requirements.**

**The actual backend repository is the source of truth for implementation.**

**`IMPLEMENTATION.md` documents the current implementation and is expected to change as the project evolves.**
