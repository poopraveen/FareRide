import { type ArgumentsHost, HttpStatus, Logger, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiException, ApiExceptionFilter } from './api-exception.filter.js';

function hostFor(requestId: string) {
  const send = vi.fn();
  const status = vi.fn(() => ({ send }));
  const host = {
    switchToHttp: () => ({
      getRequest: () => ({ id: requestId, url: '/v1/test' }),
      getResponse: () => ({ status }),
    }),
  } as unknown as ArgumentsHost;
  return { host, status, send };
}

describe('ApiExceptionFilter', () => {
  const filter = new ApiExceptionFilter();

  let logError: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logError = vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
  });

  it('returns the code, message and details of an ApiException', () => {
    const { host, status, send } = hostFor('req-1');

    filter.catch(
      new ApiException('CONFLICT', 'Ride already accepted', HttpStatus.CONFLICT, { rideId: 'r1' }),
      host,
    );

    expect(status).toHaveBeenCalledWith(409);
    expect(send).toHaveBeenCalledWith({
      success: false,
      error: { code: 'CONFLICT', message: 'Ride already accepted', details: { rideId: 'r1' } },
      requestId: 'req-1',
    });
  });

  it('maps framework HTTP exceptions to error codes', () => {
    const { host, status, send } = hostFor('req-2');

    filter.catch(new NotFoundException('Ride was not found'), host);

    expect(status).toHaveBeenCalledWith(404);
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        error: { code: 'NOT_FOUND', message: 'Ride was not found', details: {} },
      }),
    );
  });

  it('hides the message and stack of unexpected errors', () => {
    const { host, status, send } = hostFor('req-3');

    filter.catch(
      new Error('connection string mongodb+srv://app:secret@cluster0.example.net leaked'),
      host,
    );

    expect(status).toHaveBeenCalledWith(500);
    const body = JSON.stringify(send.mock.calls[0]);
    expect(body).toContain('INTERNAL_ERROR');
    expect(body).not.toContain('secret');
    expect(body).not.toContain('stack');
    expect(logError).toHaveBeenCalled();
  });
});
