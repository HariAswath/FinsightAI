import { AgentTraceEvent, TraceStepType } from '../types/agent.types';

export type TraceListener = (event: AgentTraceEvent) => void;

/**
 * Real-Time Trace Emitter for Glass Box Auditable Pipeline.
 * Dispatches live execution events to SSE and WebSocket subscribers.
 * Adheres to Section 25 & 27 of docs/IMPLEMENTATION.md.
 */
export class TraceEmitter {
  private listeners: Set<TraceListener> = new Set();

  public subscribe(listener: TraceListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public emit(event: AgentTraceEvent): void {
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (err) {
        // Ignore subscriber delivery errors
      }
    }
  }

  public createEvent(
    step: TraceStepType,
    status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED',
    message: string,
    agent?: string,
    durationMs?: number,
    data?: any
  ): AgentTraceEvent {
    const event: AgentTraceEvent = {
      step,
      status,
      message,
      agent,
      durationMs,
      timestamp: new Date().toISOString(),
      data
    };
    this.emit(event);
    return event;
  }
}

export const traceEmitter = new TraceEmitter();
