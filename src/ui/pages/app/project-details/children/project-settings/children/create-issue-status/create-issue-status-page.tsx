import { valibotResolver } from '@hookform/resolvers/valibot'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { generatePath, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import * as v from 'valibot'

import type { Project } from '@/domain/types.ts'
import type { CreateIssueStatus } from '@/features/issue-statuses/actions.ts'
import type { GetCurrentUserRole } from '@/features/memberships/actions.ts'

import {
  ISSUE_STATUS_CATEGORIES,
  ISSUE_STATUS_CATEGORY_TEXTS,
} from '@/shared/constants/project-constants.tsx'
import { getInfraErrorMessage } from '@/shared/result.ts'
import { LoadingState } from '@/ui/components/loading-state'
import { useCreateIssueStatusMutation } from '@/ui/query-hooks/issue-statuses/create-issue-status'
import { useCurrentUserRoleQuery } from '@/ui/query-hooks/memberships/get-current-user-role'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/shadcn/components/ui/select.tsx'

const createStatusSchema = v.object({
  category: v.picklist(ISSUE_STATUS_CATEGORIES),
  name: v.pipe(v.string(), v.minLength(1, 'Issue status name is required')),
})

type CreateStatusFormValues = v.InferOutput<typeof createStatusSchema>

export function CreateIssueStatusPage({
  deps,
  projectId,
}: {
  deps: {
    createIssueStatus: CreateIssueStatus
    getCurrentUserRole: GetCurrentUserRole
  }
  projectId: Project['id']
}) {
  const navigate = useNavigate()
  const { data: currentUserRoleResult, isLoading } = useCurrentUserRoleQuery(
    projectId,
    deps.getCurrentUserRole,
  )
  const { isPending: isCreating, mutate: createStatus } =
    useCreateIssueStatusMutation(deps.createIssueStatus)
  const currentUserRole = currentUserRoleResult?.ok
    ? currentUserRoleResult.value
    : null

  const form = useForm<CreateStatusFormValues>({
    defaultValues: {
      category: 'todo',
      name: '',
    },
    mode: 'onBlur',
    resolver: valibotResolver(createStatusSchema),
  })

  const goBack = () =>
    navigate(
      generatePath(ROUTES.PROJECT_SETTINGS_ISSUE_STATUSES, { projectId }),
    )

  const onSubmit = (values: CreateStatusFormValues) => {
    createStatus(
      {
        ...values,
        projectId,
      },
      {
        onSuccess: (res) => {
          if (!res.ok) {
            form.setError('root', {
              message: getInfraErrorMessage(res.error),
            })
            return
          }
          toast.success('Status created successfully')
          goBack()
        },
      },
    )
  }

  const canCreate = currentUserRole === 'admin'

  return (
    <Card>
      <CardContent className="pt-6">
        {isLoading ? (
          <LoadingState />
        ) : !canCreate ? (
          <ErrorPermissionState error={null} />
        ) : (
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Status Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter issue status name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={(val) => {
                        if (val === '') return
                        field.onChange(val)
                      }}
                      value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ISSUE_STATUS_CATEGORIES.map((type) => (
                          <SelectItem
                            key={type}
                            value={type}>
                            {ISSUE_STATUS_CATEGORY_TEXTS[type]}
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

              <div className="flex gap-2">
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
                  disabled={isCreating}
                  onClick={goBack}
                  type="button"
                  variant="outline">
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  )
}

function ErrorPermissionState({ error }: { error: Error | null }) {
  return (
    <div className="border-destructive/30 text-destructive rounded-lg border p-4 text-center">
      Error:{' '}
      {error?.message || 'You do not have permission to perform this action.'}
    </div>
  )
}
