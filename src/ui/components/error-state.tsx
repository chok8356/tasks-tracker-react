import type { InfraError } from '@/shared/result.ts'

import { getInfraErrorMessage } from '@/shared/result.ts'

export function ErrorState({ error }: { error: Error | InfraError }) {
  const message = getInfraErrorMessage(error)

  return (
    <div className="border-destructive/30 text-destructive rounded-lg border p-4 text-center">
      Error: {message}
    </div>
  )
}
