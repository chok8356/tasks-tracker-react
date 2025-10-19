import { valibotResolver } from '@hookform/resolvers/valibot'
import { Loader2 } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { generatePath, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import * as v from 'valibot'

import type { IssueStatus, Project } from '@/domain/types.ts'
import type { GetIssueStatusesUseCase } from '@/domain/use-cases/issue-statuses/get-issue-statuses'
import type { UpdateIssueStatusUseCase } from '@/domain/use-cases/issue-statuses/update-issue-status'
import type { GetCurrentUserRoleUseCase } from '@/domain/use-cases/memberships/get-current-user-role'

import { useIssueStatusesQuery } from '@/app/query-hooks/issue-statuses/get-issue-statuses'
import { useUpdateIssueStatusMutation } from '@/app/query-hooks/issue-statuses/update-issue-status'
import { useCurrentUserRoleQuery } from '@/app/query-hooks/memberships/get-current-user-role'
import {
  ISSUE_STATUS_CATEGORIES,
  ISSUE_STATUS_CATEGORY_TEXTS,
} from '@/shared/constants/project-constants.tsx'
import { LoadingState } from '@/ui/components/loading-state'
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

const editStatusSchema = v.object({
  category: v.picklist(ISSUE_STATUS_CATEGORIES),
  name: v.pipe(v.string(), v.minLength(1, 'Issue status name is required')),
})

type EditStatusFormValues = v.InferOutput<typeof editStatusSchema>

export function EditIssueStatusPage({
  projectId,
  statusId,
  useCases,
}: {
  projectId: Project['id']
  statusId: IssueStatus['id']
  useCases: {
    getCurrentUserRoleUseCase: GetCurrentUserRoleUseCase
    getIssueStatusesUseCase: GetIssueStatusesUseCase
    updateIssueStatusUseCase: UpdateIssueStatusUseCase
  }
}) {
  const navigate = useNavigate()

  const {
    data: statuses,
    error: statusesError,
    isLoading: statusesLoading,
  } = useIssueStatusesQuery(projectId, useCases.getIssueStatusesUseCase)
  const {
    data: currentUserRole,
    error: roleError,
    isLoading: roleLoading,
  } = useCurrentUserRoleQuery(projectId, useCases.getCurrentUserRoleUseCase)
  const { isPending: isSaving, mutate: updateStatus } =
    useUpdateIssueStatusMutation(projectId, useCases.updateIssueStatusUseCase)

  const statusData = useMemo(() => {
    return statuses?.find((s) => s.id === statusId)
  }, [statuses, statusId])

  const isLoading = statusesLoading || roleLoading
  const error = statusesError || roleError

  const form = useForm<EditStatusFormValues>({
    defaultValues: {
      category: 'todo',
      name: '',
    },
    mode: 'onBlur',
    resolver: valibotResolver(editStatusSchema),
  })

  useEffect(() => {
    if (statusData) {
      form.reset(statusData)
    }
  }, [statusData, form])

  const goBack = () =>
    navigate(
      generatePath(ROUTES.PROJECT_SETTINGS_ISSUE_STATUSES, { projectId }),
    )

  const onSubmit = (values: EditStatusFormValues) => {
    if (!statusData) return

    updateStatus(
      {
        ...values,
        id: statusId,
        order: statusData.order,
      },
      {
        onError: (err) => {
          form.setError('root', { message: err.message })
        },
        onSuccess: () => {
          toast.success('Status updated successfully')
          goBack()
        },
      },
    )
  }

  const canEdit = currentUserRole === 'admin'

  return (
    <Card>
      <CardContent className="pt-6">
        {isLoading ? (
          <LoadingState />
        ) : !canEdit || error || !statusData ? (
          <ErrorPermissionState
            error={error || new Error('Status not found.')}
          />
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
                  disabled={isSaving || !form.formState.isDirty}
                  type="submit">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save'
                  )}
                </Button>
                <Button
                  disabled={isSaving}
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
