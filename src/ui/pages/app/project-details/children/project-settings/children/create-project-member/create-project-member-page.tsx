import { valibotResolver } from '@hookform/resolvers/valibot'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { generatePath, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import * as v from 'valibot'

import type { Project } from '@/domain/types.ts'
import type {
  GetCurrentUserRole,
  InviteMember,
} from '@/features/memberships/actions.ts'

import { getInfraErrorMessage } from '@/shared/result.ts'
import { LoadingState } from '@/ui/components/loading-state'
import { useCurrentUserRoleQuery } from '@/ui/query-hooks/memberships/get-current-user-role'
import { useInviteMemberMutation } from '@/ui/query-hooks/memberships/invite-member'
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

const createMemberSchema = v.object({
  email: v.pipe(
    v.string(),
    v.minLength(1, 'Email is required'),
    v.email('Invalid email address'),
  ),
})

type CreateMemberFormValues = v.InferInput<typeof createMemberSchema>

export function CreateProjectMemberPage({
  deps,
  projectId,
}: {
  deps: {
    getCurrentUserRole: GetCurrentUserRole
    inviteMember: InviteMember
  }
  projectId: Project['id']
}) {
  const navigate = useNavigate()
  const { data: currentUserRoleResult, isLoading } = useCurrentUserRoleQuery(
    projectId,
    deps.getCurrentUserRole,
  )
  const { isPending: isAdding, mutate: inviteMember } = useInviteMemberMutation(
    projectId,
    deps.inviteMember,
  )
  const currentUserRole = currentUserRoleResult?.ok
    ? currentUserRoleResult.value
    : null

  const form = useForm<CreateMemberFormValues>({
    defaultValues: {
      email: '',
    },
    mode: 'onBlur',
    resolver: valibotResolver(createMemberSchema),
  })

  const goBack = () =>
    navigate(generatePath(ROUTES.PROJECT_SETTINGS_MEMBERS, { projectId }))

  const onSubmit = (values: CreateMemberFormValues) => {
    inviteMember(
      {
        ...values,
        projectId,
        role: 'member',
      },
      {
        onSuccess: (res) => {
          if (!res.ok) {
            form.setError('root', {
              message: getInfraErrorMessage(res.error),
            })
            return
          }
          toast.success('Member added successfully')
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter user email to add"
                        {...field}
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

              <div className="flex gap-2">
                <Button
                  disabled={isAdding || !form.formState.isDirty}
                  type="submit">
                  {isAdding ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add'
                  )}
                </Button>
                <Button
                  disabled={isAdding}
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
