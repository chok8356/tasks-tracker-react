export function EmptyState({ text }: { text: string }) {
  return (
    <div className="text-muted-foreground border-muted-foreground rounded-md border p-4 text-center">
      <p>{text}</p>
    </div>
  )
}
