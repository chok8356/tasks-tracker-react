import { getCurrentUser } from '@/infra/users/get-current-user'
import { AppLayout } from '@/ui/layouts/app-layout'

export const appLayoutLazyLoader = async () => {
  return {
    Component: () => <AppLayout deps={{ getCurrentUser }} />,
  }
}
