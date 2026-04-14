// src/automation/logs/log_writer.ts

import fs from "fs"
import path from "path"

export interface AutomationLogEntry {
  type: "pipeline" | "error" | "dispatch" | "debug"
  message: string
  data?: any
  timestamp: number
}

/**
 * Writes structured automation logs to disk.
 * This is the core logging engine for the automation subsystem.
 */
export class AutomationLogWriter {
  private logDir: string

  constructor(logDir = "logs/automation") {
    this.logDir = logDir

    // Ensure directory exists
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true })
    }
  }

  /**
   * Writes a structured log entry to a daily log file.
   */
  write(entry: AutomationLogEntry) {
    const date = new Date()
    const fileName = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}.log`

    const filePath = path.join(this.logDir, fileName)

    const line = JSON.stringify({
      ...entry,
      timestamp: entry.timestamp ?? Date.now()
    })

    fs.appendFileSync(filePath, line + "\n")
  }

  /**
   * Convenience method for pipeline logs.
   */
  pipeline(message: string, data?: any) {
    this.write({
      type: "pipeline",
      message,
      data,
      timestamp: Date.now()
    })
  }

  /**
   * Convenience method for dispatch logs.
   */
  dispatch(message: string, data?: any) {
    this.write({
      type: "dispatch",
      message,
      data,
      timestamp: Date.now()
    })
  }

  /**
   * Convenience method for error logs.
   */
  error(message: string, data?: any) {
    this.write({
      type: "error",
      message,
      data,
      timestamp: Date.now()
    })
  }

  /**
   * Convenience method for debug logs.
   */
  debug(message: string, data?: any) {
    this.write({
      type: "debug",
      message,
      data,
      timestamp: Date.now()
    })
  }
}
