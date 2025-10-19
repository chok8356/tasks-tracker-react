import { getCurrentUserUseCase } from '@/app/use-cases/users/get-current-user'
import { AppLayout } from '@/ui/layouts/app-layout'

export const appLayoutLazyLoader = async () => {
  return {
    Component: () => <AppLayout useCases={{ getCurrentUserUseCase }} />,
  }
}
