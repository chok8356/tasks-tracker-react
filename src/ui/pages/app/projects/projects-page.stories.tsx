import type { Meta, StoryObj } from '@storybook/react-vite'

import { expect, fn } from 'storybook/test'

import type { GetProjectsUseCase } from '@/domain/use-cases/projects/get-projects'

import { wait } from '@/shared/wait.ts'

import { ProjectsPage } from './projects-page.tsx'

const meta: Meta<typeof ProjectsPage> = {
  component: ProjectsPage,
  title: 'Pages/ProjectsList',
}

export default meta
type Story = StoryObj<typeof ProjectsPage>

const API_DELAY = 50

const getProjectsUseCaseOk = fn<GetProjectsUseCase>(async () => {
  await wait(API_DELAY)
  return [
    {
      createdAt: new Date(),
      description: '',
      id: '1',
      key: 'ALPHA',
      name: 'Project Alpha',
      ownerId: 'user-1',
      updatedAt: new Date(),
    },
  ]
})

const getProjectsUseCaseOkEmpty = fn<GetProjectsUseCase>(async () => {
  return []
})

const getProjectsUseCaseErr = fn<GetProjectsUseCase>(async () => {
  throw new Error('Server error: 500')
})

export const Success: Story = {
  args: {
    useCases: {
      getProjectsUseCase: getProjectsUseCaseOk,
    },
  },
  play: async ({ canvas }) => {
    const loader = await canvas.findByText('Loading...')
    await expect(loader).toBeInTheDocument()

    const projectLink = await canvas.findByRole('link', {
      name: /Project Alpha/i,
    })
    expect(projectLink).toBeInTheDocument()
    expect(projectLink).toHaveAttribute('href', '/projects/1')
  },
}

export const Empty: Story = {
  args: {
    useCases: {
      getProjectsUseCase: getProjectsUseCaseOkEmpty,
    },
  },
  play: async ({ canvas }) => {
    const text = canvas.findByText('No projects have been created yet.')
    await expect(text).resolves.toBeInTheDocument()
  },
}

export const ErrorState: Story = {
  args: {
    useCases: {
      getProjectsUseCase: getProjectsUseCaseErr,
    },
  },
  play: async ({ canvas }) => {
    const text = canvas.findByText(/Server error: 500/i)
    await expect(text).resolves.toBeInTheDocument()
  },
}
