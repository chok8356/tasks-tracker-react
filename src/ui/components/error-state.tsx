export function ErrorState({ error }: { error: Error }) {
  return (
    <div className="border-destructive/30 text-destructive rounded-lg border p-4 text-center">
      Error: {error.message}
    </div>
  )
}
