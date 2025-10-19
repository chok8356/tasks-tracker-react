import { getCurrentUserUseCase } from '@/app/use-cases/users/get-current-user'
import { updateUserUseCase } from '@/app/use-cases/users/update-user'
import { UserPage } from '@/ui/pages/app/user/user-page'

export const userLazyLoader = async () => {
  return {
    Component: () => (
      <UserPage
        useCases={{
          getCurrentUserUseCase,
          updateUserUseCase,
        }}
      />
    ),
  }
}
