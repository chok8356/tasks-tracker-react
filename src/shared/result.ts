export type AsyncResult<T, E> = Promise<Result<T, E>>
export type Err<E> = { error: E; ok: false }
export type InfraError = {
  _t: 'infra'
  message: string
}
export type Ok<T> = { ok: true; value: T }
export type Result<T, E> = Err<E> | Ok<T>

export const ok = <T>(value: T): Ok<T> => ({ ok: true, value })
export const err = <E>(error: E): Err<E> => ({ error, ok: false })

const DEFAULT_INFRA_ERROR_MESSAGE = 'Infrastructure error. Please try again.'

export const getInfraErrorMessage = (
  error: Error | InfraError,
  fallback = DEFAULT_INFRA_ERROR_MESSAGE,
) => ('message' in error && error.message ? error.message : fallback)

export const toInfraError = (
  source?: unknown,
  fallback = DEFAULT_INFRA_ERROR_MESSAGE,
): InfraError => ({
  _t: 'infra',
  message:
    source instanceof Error
      ? source.message
      : typeof source === 'string' && source
        ? source
        : fallback,
})
