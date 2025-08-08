import { Request, Response, NextFunction } from 'express';

/**
 * Logs basic HTTP request details once the response is finished.
 * Fields: timestamp, method, url, status, durationMs, ip, userAgent
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = process.hrtime.bigint();

  const requestMethod = req.method;
  const requestUrl = req.originalUrl || req.url;
  const requestIp = req.ip || req.socket.remoteAddress || '';
  const userAgent = req.get('user-agent') || '';

  res.on('finish', () => {
    const endTime = process.hrtime.bigint();
    const durationMs = Number(endTime - startTime) / 1_000_000; // ns -> ms
    const statusCode = res.statusCode;
    const level = statusCode >= 400 ? 'error' : 'info';

    // Structured log for easy parsing
    const logPayload = {
      level,
      event: 'http_request',
      time: new Date().toISOString(),
      method: requestMethod,
      url: requestUrl,
      status: statusCode,
      durationMs: Number(durationMs.toFixed(1)),
      ip: requestIp,
      userAgent
    };

    if (level === 'error') {
      console.error(JSON.stringify(logPayload));
    } else {
      console.log(JSON.stringify(logPayload));
    }
  });

  next();
};


