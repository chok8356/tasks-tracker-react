import { valibotResolver } from '@hookform/resolvers/valibot'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { generatePath, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import * as v from 'valibot'

import type { Project } from '@/domain/types.ts'
import type { GetIssueTypesUseCase } from '@/domain/use-cases/issue-types/get-issue-types'
import type { CreateIssueUseCase } from '@/domain/use-cases/issues/create-issue'
import type { GetCurrentUserRoleUseCase } from '@/domain/use-cases/memberships/get-current-user-role'

import { useIssueTypesQuery } from '@/app/query-hooks/issue-types/get-issue-types'
import { useCreateIssueMutation } from '@/app/query-hooks/issues/create-issue'
import { useCurrentUserRoleQuery } from '@/app/query-hooks/memberships/get-current-user-role'
import { LoadingState } from '@/ui/components/loading-state'
import { ROUTES } from '@/ui/router/routes'
import { Button } from '@/ui/shadcn/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/ui/shadcn/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/shadcn/components/ui/form'
import { Input } from '@/ui/shadcn/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/shadcn/components/ui/select'
import { Textarea } from '@/ui/shadcn/components/ui/textarea'

const createIssueSchema = v.object({
  description: v.string(),
  summary: v.pipe(v.string(), v.minLength(1, 'Issue summary is required')),
  typeId: v.pipe(v.string(), v.minLength(1, 'Issue type is required')),
})

type CreateIssueFormValues = v.InferInput<typeof createIssueSchema>

export function CreateIssuePage({
  projectId,
  useCases,
}: {
  projectId: Project['id']
  useCases: {
    createIssueUseCase: CreateIssueUseCase
    getCurrentUserRoleUseCase: GetCurrentUserRoleUseCase
    getIssueTypesUseCase: GetIssueTypesUseCase
  }
}) {
  const navigate = useNavigate()

  const { data: issueTypes, isLoading: isLoadingTypes } = useIssueTypesQuery(
    projectId,
    useCases.getIssueTypesUseCase,
  )
  const { data: currentUserRole, isLoading: isLoadingRole } =
    useCurrentUserRoleQuery(projectId, useCases.getCurrentUserRoleUseCase)
  const { isPending: isCreating, mutate: createIssue } = useCreateIssueMutation(
    projectId,
    useCases.createIssueUseCase,
  )

  const form = useForm<CreateIssueFormValues>({
    defaultValues: {
      description: '',
      summary: '',
      typeId: '',
    },
    mode: 'onBlur',
    resolver: valibotResolver(createIssueSchema),
  })

  const onSubmit = (values: CreateIssueFormValues) => {
    createIssue(
      {
        ...values,
        projectId,
      },
      {
        onError: (error) => {
          form.setError('root', { message: error.message })
        },
        onSuccess: (newIssue) => {
          toast.success(`Issue "${newIssue.id}" has been created.`)
          navigate(
            generatePath(ROUTES.PROJECT_ISSUES_ISSUE, {
              issueId: newIssue.id,
              projectId,
            }),
          )
        },
      },
    )
  }

  const isLoading = isLoadingTypes || isLoadingRole
  const canCreate = currentUserRole === 'admin' || currentUserRole === 'member'

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Create Issue</CardTitle>
        <CardDescription>
          Create a new issue for your project backlog.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <LoadingState />
        ) : !canCreate ? (
          <ErrorPermissionState />
        ) : (
          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter issue summary"
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        className="resize-none"
                        placeholder="Enter issue description (optional)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="typeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Type</FormLabel>
                    <Select
                      onValueChange={(val) => {
                        if (val === '') return
                        field.onChange(val)
                      }}
                      value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select issue type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {issueTypes?.map((type) => (
                          <SelectItem
                            key={type.id}
                            value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.formState.errors.root && (
                <div className="border-destructive/30 text-destructive rounded-lg border p-4 text-center">
                  Error: {form.formState.errors.root.message}
                </div>
              )}

              <CardFooter className="gap-2 px-0">
                <Button
                  disabled={isCreating || !form.formState.isDirty}
                  type="submit">
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create'
                  )}
                </Button>

                <Button
                  data-testid="btn-reset"
                  disabled={isCreating || !form.formState.isDirty}
                  onClick={() => form.reset()}
                  type="button"
                  variant="outline">
                  Reset
                </Button>
              </CardFooter>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  )
}

function ErrorPermissionState() {
  return (
    <div className="border-destructive/30 text-destructive rounded-lg border p-4 text-center">
      Error: You do not have permission to create issues in this project.
    </div>
  )
}
