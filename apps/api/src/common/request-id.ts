import { randomUUID } from 'node:crypto';
import { type IncomingMessage } from 'node:http';

export const REQUEST_ID_HEADER = 'x-request-id';

// Accept caller-supplied IDs only if they are short and log-safe, so a client cannot inject log lines.
const SAFE_REQUEST_ID = /^[A-Za-z0-9._:-]{8,128}$/;

/**
 * Resolves the request ID once per request and writes it back onto the raw headers,
 * so Fastify (request.id) and the pino HTTP logger (req.id) agree on the same value.
 */
export function resolveRequestId(req: IncomingMessage): string {
  const incoming = req.headers[REQUEST_ID_HEADER];
  const candidate = Array.isArray(incoming) ? incoming[0] : incoming;
  const id = candidate !== undefined && SAFE_REQUEST_ID.test(candidate) ? candidate : randomUUID();
  req.headers[REQUEST_ID_HEADER] = id;
  return id;
}
