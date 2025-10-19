import type { Meta, StoryObj } from '@storybook/react-vite'

import { expect, fn, userEvent, waitFor } from 'storybook/test'

import type { GetCurrentUserUseCase } from '@/domain/use-cases/users/get-current-user.ts'
import type { UpdateUserUseCase } from '@/domain/use-cases/users/update-user.ts'

import { wait } from '@/shared/wait.ts'

import { UserPage } from './user-page.tsx'

const meta = {
  component: UserPage,
  title: 'Pages/UserPage',
} satisfies Meta<typeof UserPage>

export default meta
type Story = StoryObj<typeof meta>

const API_DELAY = 50

const getCurrentUserUseCaseOk = fn<GetCurrentUserUseCase>(async () => {
  await wait(API_DELAY)
  return {
    email: 'john@example.com',
    id: '1',
    name: 'John',
  }
})

const getCurrentUserUseCaseErr = fn<GetCurrentUserUseCase>(async () => {
  await wait(API_DELAY)
  throw new Error('Server error: 500')
})

const updateUserUseCaseOk = fn<UpdateUserUseCase>(async (req) => {
  await wait(API_DELAY)
  return {
    email: 'john@example.com',
    id: '1',
    name: req.name ?? 'John Doe',
  }
})

const updateUserUseCaseErr = fn<UpdateUserUseCase>(async () => {
  await wait(API_DELAY)
  throw new Error('Failed to update')
})

export const InitialLoad: Story = {
  args: {
    useCases: {
      getCurrentUserUseCase: getCurrentUserUseCaseOk,
      updateUserUseCase: updateUserUseCaseOk,
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
    useCases: {
      getCurrentUserUseCase: getCurrentUserUseCaseErr,
      updateUserUseCase: updateUserUseCaseOk,
    },
  },
  play: async ({ canvas }) => {
    const loader = await canvas.findByText('Loading...')
    await expect(loader).toBeInTheDocument()

    await waitFor(async () => {
      const error = await canvas.findByText('Error: Server error: 500')
      await expect(error).toBeInTheDocument()
    })
  },
}

export const UpdateSuccess: Story = {
  args: {
    useCases: {
      getCurrentUserUseCase: getCurrentUserUseCaseOk,
      updateUserUseCase: updateUserUseCaseOk,
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
    useCases: {
      getCurrentUserUseCase: getCurrentUserUseCaseOk,
      updateUserUseCase: updateUserUseCaseErr,
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
        await canvas.findByText('Error: Failed to update'),
      ).toBeInTheDocument()
    })
  },
}

export const ValidationError: Story = {
  args: {
    useCases: {
      getCurrentUserUseCase: getCurrentUserUseCaseOk,
      updateUserUseCase: updateUserUseCaseOk,
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
