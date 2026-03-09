import type { Meta, StoryObj } from '@storybook/react-vite'

import { expect, fn } from 'storybook/test'

import type { GetProjects } from '@/features/projects/actions.ts'

import { err, ok, toInfraError } from '@/shared/result.ts'
import { wait } from '@/shared/wait.ts'

import { ProjectsPage } from './projects-page.tsx'

const meta: Meta<typeof ProjectsPage> = {
  component: ProjectsPage,
  title: 'Pages/ProjectsList',
}

export default meta
type Story = StoryObj<typeof ProjectsPage>

const API_DELAY = 50

const getProjectsOk = fn<GetProjects>(async () => {
  await wait(API_DELAY)
  return ok([
    {
      createdAt: new Date(),
      description: '',
      id: '1',
      key: 'ALPHA',
      name: 'Project Alpha',
      ownerId: 'user-1',
      updatedAt: new Date(),
    },
  ])
})

const getProjectsOkEmpty = fn<GetProjects>(async () => {
  return ok([])
})

const getProjectsErr = fn<GetProjects>(async () => err(toInfraError()))

export const Success: Story = {
  args: {
    deps: {
      getProjects: getProjectsOk,
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
    deps: {
      getProjects: getProjectsOkEmpty,
    },
  },
  play: async ({ canvas }) => {
    const text = canvas.findByText('No projects have been created yet.')
    await expect(text).resolves.toBeInTheDocument()
  },
}

export const ErrorState: Story = {
  args: {
    deps: {
      getProjects: getProjectsErr,
    },
  },
  play: async ({ canvas }) => {
    const text = canvas.findByText(/Infrastructure error\. Please try again\./i)
    await expect(text).resolves.toBeInTheDocument()
  },
}
