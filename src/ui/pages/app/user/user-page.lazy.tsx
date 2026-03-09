import { getCurrentUser } from '@/infra/users/get-current-user'
import { updateUser } from '@/infra/users/update-user'
import { UserPage } from '@/ui/pages/app/user/user-page'

export const userLazyLoader = async () => {
  return {
    Component: () => (
      <UserPage
        deps={{
          getCurrentUser,
          updateUser,
        }}
      />
    ),
  }
}
