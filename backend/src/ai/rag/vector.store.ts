import { RegulatoryFilingDoc, HARDCODED_MARKET_DATA } from '../../market/market.data';
import { AgentEvidence } from '../types/agent.types';

export interface DocumentChunk {
  id: string;
  symbol: string;
  source: string;
  title: string;
  filingDate: string;
  section?: string;
  excerpt: string;
  relevanceBase: number;
}

/**
 * In-Memory RAG Vector & Semantic Retrieval Store.
 * Implements lexical BM25-style scoring and token overlap for grounded regulatory evidence retrieval.
 * Adheres to Section 12-14 of docs/IMPLEMENTATION.md.
 */
export class InMemoryRAGStore {
  private chunks: DocumentChunk[] = [];
  private isIndexed = false;

  constructor() {
    this.bootstrapFromMarketData();
  }

  /**
   * Automatically bootstrap knowledge base with regulatory filings from market data
   */
  public bootstrapFromMarketData(): void {
    if (this.isIndexed) return;

    for (const [symbol, equity] of Object.entries(HARDCODED_MARKET_DATA)) {
      if (equity.filings && Array.isArray(equity.filings)) {
        for (const filing of equity.filings) {
          for (let i = 0; i < filing.keyExcerpts.length; i++) {
            const excerpt = filing.keyExcerpts[i];
            this.chunks.push({
              id: `${filing.id}-chunk-${i + 1}`,
              symbol: symbol.toUpperCase(),
              source: filing.source,
              title: filing.title,
              filingDate: filing.filingDate,
              section: filing.source === 'SEBI_LODR' ? 'Regulation 30 Material Disclosure' : 'Management Briefing',
              excerpt,
              relevanceBase: filing.relevanceScore
            });
          }
        }
      }
    }

    this.isIndexed = true;
    console.log(`[InMemoryRAGStore] Indexed ${this.chunks.length} regulatory excerpts across ${Object.keys(HARDCODED_MARKET_DATA).length} equities.`);
  }

  public addChunks(newChunks: DocumentChunk[]): void {
    this.chunks.push(...newChunks);
  }

  /**
   * Search for grounded evidence matching query and symbol.
   */
  public async search(query: string, symbol: string, topK: number = 3): Promise<AgentEvidence[]> {
    const sym = symbol.toUpperCase();
    const symbolChunks = this.chunks.filter(c => c.symbol === sym);

    if (symbolChunks.length === 0) {
      return [];
    }

    const queryTokens = this.tokenize(query.toLowerCase());

    const scored = symbolChunks.map(chunk => {
      const chunkTokens = this.tokenize((chunk.title + ' ' + chunk.excerpt).toLowerCase());
      const score = this.calculateSimilarity(queryTokens, chunkTokens, chunk.relevanceBase);

      return {
        chunk,
        score
      };
    });

    // Sort descending by score
    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, topK).map(({ chunk, score }) => ({
      source: chunk.source,
      title: chunk.title,
      filingDate: chunk.filingDate,
      section: chunk.section,
      excerpt: chunk.excerpt,
      relevanceScore: Math.min(1.0, Math.round((score) * 100) / 100),
      sentiment: 'POSITIVE' as const
    }));
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 2);
  }

  private calculateSimilarity(queryTokens: string[], docTokens: string[], baseRelevance: number): number {
    if (queryTokens.length === 0 || docTokens.length === 0) {
      return baseRelevance;
    }

    let matchCount = 0;
    const docSet = new Set(docTokens);

    for (const q of queryTokens) {
      if (docSet.has(q)) {
        matchCount++;
      }
    }

    const jaccard = matchCount / (queryTokens.length + docTokens.length - matchCount);
    // Weighted blend of base relevance and query token overlap
    return (0.6 * baseRelevance) + (0.4 * Math.min(1.0, jaccard * 3));
  }
}

export const ragStore = new InMemoryRAGStore();
