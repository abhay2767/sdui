export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  tag: string;
  message: string;
  data?: any;
}

class SDUILogger {
  private logs: LogEntry[] = [];
  private maxLogs = 200;

  public log(level: LogLevel, tag: string, message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      tag,
      message,
      data,
    };
    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    if (__DEV__) {
      const formatted = `[SDUI][${tag}][${level.toUpperCase()}] ${message}`;
      if (level === 'error') {
        console.error(formatted, data || '');
      } else if (level === 'warn') {
        console.warn(formatted, data || '');
      } else {
        console.log(formatted, data || '');
      }
    }
  }

  public warn(tag: string, message: string, data?: any) {
    this.log('warn', tag, message, data);
  }

  public error(tag: string, message: string, data?: any) {
    this.log('error', tag, message, data);
  }

  public info(tag: string, message: string, data?: any) {
    this.log('info', tag, message, data);
  }

  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  public clearLogs() {
    this.logs = [];
  }
}

export const logger = new SDUILogger();
