import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { wait } from './wait'

describe('wait', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    vi.spyOn(globalThis, 'setTimeout')
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('waiting timeout', async () => {
    await wait(100)
    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 100)
  })

  it('return Promise', async () => {
    const waited = await wait(100)
    expect(waited).toBe(true)
  })
})
