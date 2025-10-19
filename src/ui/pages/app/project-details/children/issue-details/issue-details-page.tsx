import { valibotResolver } from '@hookform/resolvers/valibot'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { generatePath, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import * as v from 'valibot'

import type { Issue, Project } from '@/domain/types.ts'
import type { GetIssueStatusesUseCase } from '@/domain/use-cases/issue-statuses/get-issue-statuses'
import type { GetIssueTypesUseCase } from '@/domain/use-cases/issue-types/get-issue-types'
import type { GetIssueUseCase } from '@/domain/use-cases/issues/get-issue'
import type { UpdateIssueUseCase } from '@/domain/use-cases/issues/update-issue'
import type { GetCurrentUserRoleUseCase } from '@/domain/use-cases/memberships/get-current-user-role'
import type { GetMembershipsUseCase } from '@/domain/use-cases/memberships/get-memberships'

import { useIssueStatusesQuery } from '@/app/query-hooks/issue-statuses/get-issue-statuses'
import { useIssueTypesQuery } from '@/app/query-hooks/issue-types/get-issue-types'
import { useIssueQuery } from '@/app/query-hooks/issues/get-issue'
import { useUpdateIssueMutation } from '@/app/query-hooks/issues/update-issue'
import { useCurrentUserRoleQuery } from '@/app/query-hooks/memberships/get-current-user-role'
import { useMembershipsQuery } from '@/app/query-hooks/memberships/get-memberships'
import { ErrorState } from '@/ui/components/error-state'
import { LoadingState } from '@/ui/components/loading-state'
import { ROUTES } from '@/ui/router/routes.ts'
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

const NONE_VALUE = '__NONE__'

const issueSchema = v.object({
  assigneeId: v.nullable(v.string()),
  description: v.nullable(v.string()),
  estimate: v.nullable(
    v.pipe(v.number(), v.minValue(0, 'Estimate must be positive')),
  ),
  reporterId: v.nullable(v.string()),
  statusId: v.pipe(v.string(), v.minLength(1, 'Status is required')),
  summary: v.pipe(v.string(), v.minLength(1, 'Summary is required')),
  typeId: v.pipe(v.string(), v.minLength(1, 'Type is required')),
})

type IssueFormValues = v.InferInput<typeof issueSchema>

const useIssueDetailsData = (
  issueId: Issue['id'],
  projectId: Project['id'],
  useCases: {
    getCurrentUserRoleUseCase: GetCurrentUserRoleUseCase
    getIssueStatusesUseCase: GetIssueStatusesUseCase
    getIssueTypesUseCase: GetIssueTypesUseCase
    getIssueUseCase: GetIssueUseCase
    getMembershipsUseCase: GetMembershipsUseCase
  },
) => {
  const {
    data: issue,
    error: issueError,
    isLoading: issueLoading,
  } = useIssueQuery(issueId, useCases.getIssueUseCase)
  const {
    data: statuses,
    error: statusesError,
    isLoading: statusesLoading,
  } = useIssueStatusesQuery(projectId, useCases.getIssueStatusesUseCase)
  const {
    data: types,
    error: typesError,
    isLoading: typesLoading,
  } = useIssueTypesQuery(projectId, useCases.getIssueTypesUseCase)
  const {
    data: members,
    error: membersError,
    isLoading: membersLoading,
  } = useMembershipsQuery(projectId, useCases.getMembershipsUseCase)
  const {
    data: currentUserRole,
    error: roleError,
    isLoading: roleLoading,
  } = useCurrentUserRoleQuery(projectId, useCases.getCurrentUserRoleUseCase)

  const isLoading =
    issueLoading ||
    statusesLoading ||
    typesLoading ||
    membersLoading ||
    roleLoading
  const error =
    issueError || statusesError || typesError || membersError || roleError

  return {
    currentUserRole,
    error,
    isLoading,
    issue,
    members,
    statuses,
    types,
  }
}

export function IssueDetailsPage({
  issueId,
  projectId,
  useCases,
}: {
  issueId: Issue['id']
  projectId: Project['id']
  useCases: {
    getCurrentUserRoleUseCase: GetCurrentUserRoleUseCase
    getIssueStatusesUseCase: GetIssueStatusesUseCase
    getIssueTypesUseCase: GetIssueTypesUseCase
    getIssueUseCase: GetIssueUseCase
    getMembershipsUseCase: GetMembershipsUseCase
    updateIssueUseCase: UpdateIssueUseCase
  }
}) {
  const { currentUserRole, error, isLoading, issue, members, statuses, types } =
    useIssueDetailsData(issueId, projectId, useCases)
  const { isPending: isSaving, mutate: updateIssue } = useUpdateIssueMutation(
    issueId,
    useCases.updateIssueUseCase,
  )
  const navigate = useNavigate()
  const location = useLocation()

  const form = useForm<IssueFormValues>({
    defaultValues: {
      assigneeId: null,
      description: '',
      estimate: null,
      reporterId: null,
      statusId: '',
      summary: '',
      typeId: '',
    },
    mode: 'onBlur',
    resolver: valibotResolver(issueSchema),
  })

  useEffect(() => {
    if (issue) {
      form.reset(issue)
    }
  }, [issue, form])

  const onSubmit = (values: IssueFormValues) => {
    if (!issue) {
      throw new Error('Issue not loaded')
    }
    updateIssue(
      { ...values, id: issue.id },
      {
        onError: (err) => {
          form.setError('root', { message: err.message })
        },
        onSuccess: (data) => {
          form.reset(data)
          toast.success('Issue updated successfully')
          if (location.state?.from === 'board') {
            navigate(generatePath(ROUTES.PROJECT, { projectId }))
          } else {
            navigate(generatePath(ROUTES.PROJECT_BACKLOG, { projectId }))
          }
        },
      },
    )
  }

  const canEdit = currentUserRole === 'admin' || currentUserRole === 'member'

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Issue Details</CardTitle>
        <CardDescription>View and edit issue details.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState error={error} />
        ) : !canEdit ? (
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
                        value={field.value ?? ''}
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
                        {types?.map((type) => (
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
              <FormField
                control={form.control}
                name="statusId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Status</FormLabel>
                    <Select
                      onValueChange={(val) => {
                        if (val === '') return
                        field.onChange(val)
                      }}
                      value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select issue status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statuses?.map((status) => (
                          <SelectItem
                            key={status.id}
                            value={status.id}>
                            {status.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reporterId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reporter</FormLabel>
                    <Select
                      onValueChange={(val) => {
                        if (val === '') return
                        field.onChange(val === NONE_VALUE ? null : val)
                      }}
                      value={field.value ?? NONE_VALUE}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={NONE_VALUE}>Unassigned</SelectItem>
                        {members?.map((member) => (
                          <SelectItem
                            key={member.id}
                            value={member.id}>
                            {member.user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee</FormLabel>
                    <Select
                      onValueChange={(val) => {
                        if (val === '') return
                        field.onChange(val === NONE_VALUE ? null : val)
                      }}
                      value={field.value ?? NONE_VALUE}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={NONE_VALUE}>Unassigned</SelectItem>
                        {members?.map((member) => (
                          <SelectItem
                            key={member.id}
                            value={member.id}>
                            {member.user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="estimate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimate</FormLabel>
                    <FormControl>
                      <Input
                        onChange={(e) => {
                          const v = e.target.value
                          field.onChange(v === '' ? null : Number(v))
                        }}
                        placeholder="Enter estimate in hours"
                        type="number"
                        value={field.value ?? ''}
                      />
                    </FormControl>
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
                  data-testid="btn-reset"
                  disabled={isSaving || !form.formState.isDirty}
                  onClick={() => form.reset(issue)}
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
      Error: You do not have permission to edit issues in this project.
    </div>
  )
}
