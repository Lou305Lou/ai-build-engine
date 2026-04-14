// src/automation/meta/automation_heartbeat.ts

/**
 * Automation Heartbeat
 *
 * Tracks system liveness by updating a timestamp every time
 * the automation pipeline runs. Used by the health monitor.
 */
export class AutomationHeartbeat {
  private lastBeat: number
  private timeoutMs: number

  constructor(timeoutMs: number = 1000 * 60 * 5) {
    // Default timeout: 5 minutes
    this.lastBeat = Date.now()
    this.timeoutMs = timeoutMs
  }

  /**
   * Updates the heartbeat timestamp.
   */
  beat() {
    this.lastBeat = Date.now()
  }

  /**
   * Returns the timestamp of the last heartbeat.
   */
  getLastBeat(): number {
    return this.lastBeat
  }

  /**
   * Returns true if the system is considered alive.
   */
  isAlive(): boolean {
    return Date.now() - this.lastBeat <= this.timeoutMs
  }

  /**
   * Returns a structured liveness report.
   */
  getReport() {
    const alive = this.isAlive()

    return {
      alive,
      lastBeat: this.lastBeat,
      ageMs: Date.now() - this.lastBeat,
      timeoutMs: this.timeoutMs,
      timestamp: Date.now()
    }
  }
}
