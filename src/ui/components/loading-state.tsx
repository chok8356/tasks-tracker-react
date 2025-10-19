import { Loader2 } from 'lucide-react'

export function LoadingState() {
  return (
    <div className="flex items-center py-4">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      <span>Loading...</span>
    </div>
  )
}
