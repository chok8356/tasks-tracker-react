import type { InferOutput } from 'valibot'

import { valibotResolver } from '@hookform/resolvers/valibot'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { maxLength, minLength, object, pipe, regex, string } from 'valibot'

import type { CreateProject } from '@/features/projects/actions.ts'

import { useCreateProjectMutation } from '@/ui/query-hooks/projects/create-project'
import { ROUTES } from '@/ui/router/routes.ts'
import { Button } from '@/ui/shadcn/components/ui/button.tsx'
import { Card, CardContent } from '@/ui/shadcn/components/ui/card.tsx'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/shadcn/components/ui/form.tsx'
import { Input } from '@/ui/shadcn/components/ui/input.tsx'
import { Textarea } from '@/ui/shadcn/components/ui/textarea.tsx'

const createProjectSchema = object({
  description: string(),
  key: pipe(
    string(),
    minLength(2, 'Project key must be at least 2 characters'),
    maxLength(10, 'Project key must be at most 10 characters'),
    regex(
      /^[A-Z0-9]+$/,
      'Project key must contain only uppercase letters and numbers',
    ),
  ),
  name: pipe(string(), minLength(1, 'Project name is required')),
})

type CreateProjectFormValues = InferOutput<typeof createProjectSchema>

export function CreateProjectPage({
  deps,
}: {
  deps: {
    createProject: CreateProject
  }
}) {
  const navigate = useNavigate()
  const { isPending, mutate } = useCreateProjectMutation(deps.createProject)

  const form = useForm<CreateProjectFormValues>({
    defaultValues: {
      description: '',
      key: '',
      name: '',
    },
    resolver: valibotResolver(createProjectSchema),
  })

  const onSubmit = (values: CreateProjectFormValues) => {
    mutate(values, {
      onSuccess: (res) => {
        if (!res.ok) {
          toast.error('Failed to create project')
          return
        }

        toast.success(`Project "${res.value.name}" has been created.`)
        navigate(ROUTES.PROJECTS)
      },
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create Project
        </h1>
      </div>

      <Card className="max-w-xl">
        <CardContent className="pt-6">
          <Form {...form}>
            <form
              className="space-y-6"
              data-testid="create-project-form"
              onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input
                        data-testid="input-name"
                        placeholder="e.g. My Awesome Project"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Key</FormLabel>
                    <FormControl>
                      <Input
                        data-testid="input-key"
                        placeholder="e.g., PROJ"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A short description of the project."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={isPending}
                type="submit">
                {isPending ? 'Creating...' : 'Create Project'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
