import type { Preview } from '@storybook/react-vite'

import { MemoryRouter } from 'react-router-dom'

import '../src/index.css'
import './preview.css'
import { QueryProvider } from '../src/ui/query-provider'
import { Toaster } from '../src/ui/shadcn/components/ui/sonner'

const preview: Preview = {
  decorators: [
    (Story) => (
      <QueryProvider>
        <MemoryRouter initialEntries={['/']}>
          <Story />
          <Toaster position="bottom-right" />
        </MemoryRouter>
      </QueryProvider>
    ),
  ],
}

export default preview
