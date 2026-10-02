import { type IncomingMessage } from 'node:http';

import { describe, expect, it } from 'vitest';

import { REQUEST_ID_HEADER, resolveRequestId } from './request-id.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

function requestWith(id?: string | string[]): IncomingMessage {
  return { headers: id === undefined ? {} : { [REQUEST_ID_HEADER]: id } } as IncomingMessage;
}

describe('resolveRequestId', () => {
  it('keeps a safe caller-supplied ID', () => {
    expect(resolveRequestId(requestWith('trace-1234:abcd'))).toBe('trace-1234:abcd');
  });

  it('generates a UUID when none is supplied and writes it back to the headers', () => {
    const request = requestWith();
    const id = resolveRequestId(request);

    expect(id).toMatch(UUID);
    expect(request.headers[REQUEST_ID_HEADER]).toBe(id);
  });

  it.each([
    ['too short', 'abc'],
    ['contains a newline', 'abcdefgh\ninjected log line'],
    ['contains spaces', 'abcd efgh'],
    ['too long', 'a'.repeat(129)],
  ])('replaces an unsafe ID (%s)', (_reason, unsafe) => {
    expect(resolveRequestId(requestWith(unsafe))).toMatch(UUID);
  });

  it('uses the first value when the header is repeated', () => {
    expect(resolveRequestId(requestWith(['first-12345', 'second-1234']))).toBe('first-12345');
  });
});
