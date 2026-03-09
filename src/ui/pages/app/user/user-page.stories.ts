import type { Meta, StoryObj } from '@storybook/react-vite'

import { expect, fn, userEvent, waitFor } from 'storybook/test'

import type { GetCurrentUser, UpdateUser } from '@/features/users/actions.ts'

import { err, ok, toInfraError } from '@/shared/result.ts'
import { wait } from '@/shared/wait.ts'

import { UserPage } from './user-page.tsx'

const meta = {
  component: UserPage,
  title: 'Pages/UserPage',
} satisfies Meta<typeof UserPage>

export default meta
type Story = StoryObj<typeof meta>

const API_DELAY = 50

const getCurrentUserOk = fn<GetCurrentUser>(async () => {
  await wait(API_DELAY)
  return ok({
    email: 'john@example.com',
    id: '1',
    name: 'John',
  })
})

const getCurrentUserErr = fn<GetCurrentUser>(async () => {
  await wait(API_DELAY)
  return err(toInfraError())
})

const updateUserOk = fn<UpdateUser>(async (req) => {
  await wait(API_DELAY)
  return ok({
    email: 'john@example.com',
    id: '1',
    name: req.name ?? 'John Doe',
  })
})

const updateUserErr = fn<UpdateUser>(async () => {
  await wait(API_DELAY)
  return err(toInfraError())
})

export const InitialLoad: Story = {
  args: {
    deps: {
      getCurrentUser: getCurrentUserOk,
      updateUser: updateUserOk,
    },
  },
  play: async ({ canvas }) => {
    const loader = await canvas.findByText('Loading...')
    await expect(loader).toBeInTheDocument()

    await waitFor(async () => {
      const emailInput = await canvas.findByTestId('input-email')
      expect(emailInput).toHaveValue('john@example.com')
    })

    await waitFor(async () => {
      const nameInput = await canvas.findByTestId('input-name')
      expect(nameInput).toHaveValue('John')
    })
  },
}

export const InitialLoadError: Story = {
  args: {
    deps: {
      getCurrentUser: getCurrentUserErr,
      updateUser: updateUserOk,
    },
  },
  play: async ({ canvas }) => {
    const loader = await canvas.findByText('Loading...')
    await expect(loader).toBeInTheDocument()

    await waitFor(async () => {
      const error = await canvas.findByText(
        'Error: Infrastructure error. Please try again.',
      )
      await expect(error).toBeInTheDocument()
    })
  },
}

export const UpdateSuccess: Story = {
  args: {
    deps: {
      getCurrentUser: getCurrentUserOk,
      updateUser: updateUserOk,
    },
  },
  play: async ({ canvas }) => {
    await waitFor(async () => {
      const nameInput = await canvas.findByTestId('input-name')
      const saveButton = await canvas.findByTestId('btn-save')

      await expect(nameInput).toBeInTheDocument()
      await expect(saveButton).toBeInTheDocument()

      await userEvent.clear(nameInput)
      await userEvent.type(nameInput, 'John Doe')
      await userEvent.click(saveButton)

      await expect(
        canvas.getByRole('button', { name: /Saving.../i }),
      ).toBeInTheDocument()

      await expect(
        await canvas.findByText('User info updated successfully'),
      ).toBeInTheDocument()

      await expect(nameInput).toHaveValue('John Doe')
    })
  },
}

export const UpdateError: Story = {
  args: {
    deps: {
      getCurrentUser: getCurrentUserOk,
      updateUser: updateUserErr,
    },
  },
  play: async ({ canvas }) => {
    await waitFor(async () => {
      const nameInput = await canvas.findByTestId('input-name')
      const saveButton = await canvas.findByTestId('btn-save')

      await userEvent.clear(nameInput)
      await userEvent.type(nameInput, 'John Doe')
      await userEvent.click(saveButton)

      await expect(
        await canvas.findByText(
          'Error: Infrastructure error. Please try again.',
        ),
      ).toBeInTheDocument()
    })
  },
}

export const ValidationError: Story = {
  args: {
    deps: {
      getCurrentUser: getCurrentUserOk,
      updateUser: updateUserOk,
    },
  },
  play: async ({ canvas }) => {
    await waitFor(async () => {
      const nameInput = await canvas.findByTestId('input-name')
      const saveButton = await canvas.findByTestId('btn-save')

      await userEvent.clear(nameInput)
      await userEvent.click(saveButton)

      await expect(
        await canvas.findByText('Enter your name'),
      ).toBeInTheDocument()
    })
  },
}
