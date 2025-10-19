import type { Meta, StoryObj } from '@storybook/react-vite'

import { expect, fn, userEvent } from 'storybook/test'

import type { CreateProjectUseCase } from '@/domain/use-cases/projects/create-project'

import { wait } from '@/shared/wait.ts'

import { CreateProjectPage } from './create-project-page.tsx'

const meta: Meta<typeof CreateProjectPage> = {
  component: CreateProjectPage,
  title: 'Pages/CreateProjectPage',
}
export default meta

type Story = StoryObj<typeof CreateProjectPage>

const API_DELAY = 50

const createProjectUseCaseOk = fn<CreateProjectUseCase>(async (input) => {
  await wait(API_DELAY)
  return {
    createdAt: new Date(),
    description: input.description ?? '',
    id: 'p1',
    key: input.key,
    name: input.name,
    ownerId: 'user-1',
    updatedAt: new Date(),
  }
})

const createProjectUseCaseErr = fn<CreateProjectUseCase>(async () => {
  throw new Error('Server error: 500')
})

export const Success: Story = {
  args: {
    useCases: {
      createProjectUseCase: createProjectUseCaseOk,
    },
  },
  play: async ({ canvas, step }) => {
    await step('validation', async () => {
      await userEvent.click(
        canvas.getByRole('button', { name: /Create Project/i }),
      )
      await expect(
        canvas.findByText('Project name is required'),
      ).resolves.toBeInTheDocument()
    })

    await step('submit', async () => {
      await userEvent.type(
        canvas.getByLabelText(/Project Name/i),
        'My Success Project',
      )
      await userEvent.type(canvas.getByLabelText(/Project Key/i), 'SUCCESS')
      await userEvent.type(canvas.getByLabelText(/Description/i), 'desc ok')

      await userEvent.click(
        canvas.getByRole('button', { name: /Create Project/i }),
      )

      await expect(
        canvas.getByRole('button', { name: /Creating.../i }),
      ).toBeInTheDocument()

      await expect(
        canvas.findByText(/Project "My Success Project" has been created\./i),
      ).resolves.toBeInTheDocument()
    })
  },
}

export const ErrorState: Story = {
  args: {
    useCases: {
      createProjectUseCase: createProjectUseCaseErr,
    },
  },
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByLabelText(/Project Name/i), 'Bad')
    await userEvent.type(canvas.getByLabelText(/Project Key/i), 'BADKEY')

    await userEvent.click(
      canvas.getByRole('button', { name: /Create Project/i }),
    )

    await expect(
      canvas.findByText('Failed to create project'),
    ).resolves.toBeInTheDocument()
    await expect(
      canvas.findByText('Server error: 500'),
    ).resolves.toBeInTheDocument()
  },
}
