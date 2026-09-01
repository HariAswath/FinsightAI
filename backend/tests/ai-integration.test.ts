import http from 'http';
import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import { createApp } from '../src/app';
import { marketService } from '../src/market/market.service';

const TEST_PORT = 5099;
const BASE_URL = `http://localhost:${TEST_PORT}`;

async function runTests() {
  console.log('====================================================');
  console.log('🧪 Running Comprehensive AI Subsystem Integration Tests');
  console.log('====================================================');

  const app = createApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(TEST_PORT, () => {
      console.log(`[TestServer] Ephemeral server running on port ${TEST_PORT}`);
      resolve();
    });
  });

  try {
    await marketService.initialize();

    // 1. Health Endpoint
    console.log('\n--> [1/9] Testing /health');
    const healthRes = await axios.get(`${BASE_URL}/health`);
    if (healthRes.status === 200 && healthRes.data.status === 'ok') {
      console.log('✅ Health endpoint OK');
    } else {
      throw new Error(`Health check failed: ${JSON.stringify(healthRes.data)}`);
    }

    // 2. Existing Market Endpoint
    console.log('\n--> [2/9] Testing existing market quote endpoint /api/market/RELIANCE');
    const marketRes = await axios.get(`${BASE_URL}/api/market/RELIANCE`);
    if (marketRes.status === 200 && marketRes.data.success && marketRes.data.data.quote) {
      console.log(`✅ Existing market route intact: RELIANCE LTP=₹${marketRes.data.data.quote.ltp}`);
    } else {
      throw new Error('Market quote endpoint broken');
    }

    // 3. AI Status Endpoint
    console.log('\n--> [3/9] Testing /api/ai/status');
    const statusRes = await axios.get(`${BASE_URL}/api/ai/status`);
    console.log(`✅ AI Status OK. Provider: ${statusRes.data.provider}`);
    console.log(`   Agents available: ${statusRes.data.agentsAvailable.join(', ')}`);

    // 4. AI Profiles Preset Endpoint
    console.log('\n--> [4/9] Testing /api/ai/profiles');
    const profilesRes = await axios.get(`${BASE_URL}/api/ai/profiles`);
    const profileKeys = Object.keys(profilesRes.data.profiles);
    console.log(`✅ Profiles OK: ${profileKeys.join(', ')}`);

    // 5. AI Sample Portfolio Endpoint
    console.log('\n--> [5/9] Testing /api/ai/portfolio/sample');
    const portRes = await axios.get(`${BASE_URL}/api/ai/portfolio/sample`);
    console.log(`✅ Sample Portfolio OK. Total Value: ₹${portRes.data.portfolio.totalPortfolioValue.toLocaleString()}`);

    // 6. Full End-to-End Analysis for RELIANCE (Moderate Profile)
    console.log('\n--> [6/9] Testing POST /api/ai/analyze (RELIANCE, Moderate Profile)');
    const analyzeRes = await axios.post(`${BASE_URL}/api/ai/analyze`, {
      symbol: 'RELIANCE',
      profileId: 'moderate'
    });
    const rec = analyzeRes.data;
    console.log(`✅ Analysis Completed:`);
    console.log(`   Action: ${rec.action} (${rec.overallConfidence}% Confidence)`);
    console.log(`   Executive Summary: ${rec.executiveSummary.substring(0, 120)}...`);
    console.log(`   Agents Analyzed: ${Object.keys(rec.agents).join(', ')}`);
    console.log(`   Citations Found: ${rec.citations.length}`);
    console.log(`   Traces Generated: ${rec.traces.length} steps in ${rec.metadata.totalLatencyMs}ms`);

    // Validate structure
    if (!rec.agents['Fundamentals'] || !rec.agents['Technical'] || !rec.agents['Sentiment']) {
      throw new Error('Missing one or more specialized agents in response');
    }
    if (!rec.synthesis || !rec.synthesis.consensusSignal) {
      throw new Error('Synthesis missing consensus signal');
    }

    // 7. Personalization Profile Comparison (Section 22 & 38 Demo)
    console.log('\n--> [7/9] Testing POST /api/ai/compare-profiles (RELIANCE across Conservative, Moderate, Aggressive)');
    const compareRes = await axios.post(`${BASE_URL}/api/ai/compare-profiles`, {
      symbol: 'RELIANCE'
    });
    console.log(`✅ Profile Comparison OK for ${compareRes.data.symbol}:`);
    for (const p of compareRes.data.profiles) {
      console.log(`   [${p.riskTolerance}]: Action = ${p.action} -> ${p.explanation.substring(0, 75)}...`);
    }

    // 8. Graceful Degradation Demo (Section 39: Sentiment Failure)
    console.log('\n--> [8/9] Testing Graceful Degradation (simulateFailure: sentiment)');
    const degradedRes = await axios.post(`${BASE_URL}/api/ai/analyze`, {
      symbol: 'RELIANCE',
      simulateFailure: 'sentiment'
    });
    const degRec = degradedRes.data;
    const sentStatus = degRec.agents['Sentiment'].status;
    console.log(`✅ Sentiment Agent Status: ${sentStatus}`);
    console.log(`   Degraded Warning: ${degRec.synthesis.dataCompleteness.degradedWarning || 'None'}`);
    console.log(`   Pipeline continued cleanly: Final Action = ${degRec.action} (${degRec.overallConfidence}%)`);
    if (sentStatus !== 'unavailable') {
      throw new Error(`Expected sentiment status "unavailable", got "${sentStatus}"`);
    }

    // 9. Real-Time Server-Sent Events (SSE) Stream
    console.log('\n--> [9/9] Testing GET /api/ai/analyze/stream?symbol=TCS (SSE)');
    const sseRes = await axios.get(`${BASE_URL}/api/ai/analyze/stream?symbol=TCS&profileId=aggressive`, {
      responseType: 'text'
    });
    const sseLines = sseRes.data.split('\n').filter((l: string) => l.startsWith('event:'));
    console.log(`✅ SSE Stream OK. Received ${sseLines.length} events: ${sseLines.slice(0, 6).join(', ')}...`);

    console.log('\n====================================================');
    console.log('🎉 ALL 9 INTEGRATION TESTS PASSED SUCCESSFULLY!');
    console.log('====================================================');
  } catch (err: any) {
    console.error('\n❌ Test Failure:', err.message);
    if (err.response?.data) {
      console.error('Response data:', err.response.data);
    }
    process.exitCode = 1;
  } finally {
    server.close(() => {
      process.exit(process.exitCode || 0);
    });
    setTimeout(() => process.exit(process.exitCode || 0), 1000);
  }
}

runTests();
