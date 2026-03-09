import { valibotResolver } from '@hookform/resolvers/valibot'
import { Loader2 } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { generatePath, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import * as v from 'valibot'

import type { IssueType, Project } from '@/domain/types.ts'
import type {
  GetIssueTypes,
  UpdateIssueType,
} from '@/features/issue-types/actions.ts'
import type { GetCurrentUserRole } from '@/features/memberships/actions.ts'

import {
  getIssueIcon,
  ISSUE_TYPE_COLORS,
  ISSUE_TYPE_COLORS_BG_CLASSES,
  ISSUE_TYPE_ICONS,
} from '@/shared/constants/issue-constants.tsx'
import { getInfraErrorMessage } from '@/shared/result.ts'
import { ErrorState } from '@/ui/components/error-state'
import { LoadingState } from '@/ui/components/loading-state'
import { useIssueTypesQuery } from '@/ui/query-hooks/issue-types/get-issue-types'
import { useUpdateIssueTypeMutation } from '@/ui/query-hooks/issue-types/update-issue-type'
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
  RadioGroup,
  RadioGroupItem,
} from '@/ui/shadcn/components/ui/radio-group.tsx'
import { cn } from '@/ui/shadcn/lib/utils.ts'

const editTypeSchema = v.object({
  color: v.picklist(ISSUE_TYPE_COLORS),
  icon: v.picklist(ISSUE_TYPE_ICONS),
  name: v.pipe(v.string(), v.minLength(1, 'Issue type name is required')),
})

type EditTypeFormValues = v.InferOutput<typeof editTypeSchema>

export function EditIssueTypePage({
  deps,
  projectId,
  typeId,
}: {
  deps: {
    getCurrentUserRole: GetCurrentUserRole
    getIssueTypes: GetIssueTypes
    updateIssueType: UpdateIssueType
  }
  projectId: Project['id']
  typeId: IssueType['id']
}) {
  const navigate = useNavigate()

  const { data: typesResult, isLoading: typesLoading } = useIssueTypesQuery(
    projectId,
    deps.getIssueTypes,
  )
  const { data: currentUserRoleResult, isLoading: roleLoading } =
    useCurrentUserRoleQuery(projectId, deps.getCurrentUserRole)
  const { isPending: isSaving, mutate: updateType } =
    useUpdateIssueTypeMutation(projectId, deps.updateIssueType)

  const types = typesResult?.ok ? typesResult.value : []
  const currentUserRole = currentUserRoleResult?.ok
    ? currentUserRoleResult.value
    : null
  const error =
    typesResult && !typesResult.ok
      ? typesResult.error
      : currentUserRoleResult && !currentUserRoleResult.ok
        ? currentUserRoleResult.error
        : null
  const typeData = useMemo(() => {
    return types?.find((t) => t.id === typeId)
  }, [types, typeId])

  const isLoading = typesLoading || roleLoading

  const form = useForm<EditTypeFormValues>({
    defaultValues: {
      color: ISSUE_TYPE_COLORS[0],
      icon: ISSUE_TYPE_ICONS[0],
      name: '',
    },
    mode: 'onBlur',
    resolver: valibotResolver(editTypeSchema),
  })

  useEffect(() => {
    if (typeData) {
      form.reset(typeData)
    }
  }, [typeData, form])

  const goBack = () =>
    navigate(generatePath(ROUTES.PROJECT_SETTINGS_ISSUE_TYPES, { projectId }))

  const onSubmit = (values: EditTypeFormValues) => {
    if (!typeData) return

    updateType(
      {
        ...values,
        id: typeId,
      },
      {
        onSuccess: (res) => {
          if (!res.ok) {
            form.setError('root', {
              message: getInfraErrorMessage(res.error),
            })
            return
          }
          toast.success('Issue type updated successfully')
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
        ) : error ? (
          <ErrorState error={error} />
        ) : !canEdit || !typeData ? (
          <ErrorPermissionState
            error={!typeData ? new Error('Type not found.') : null}
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
                    <FormLabel>Issue Type Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter issue type name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <RadioGroup
                        className="flex items-center gap-2"
                        onValueChange={field.onChange}
                        value={field.value}>
                        {ISSUE_TYPE_COLORS.map((color) => (
                          <div key={color}>
                            <RadioGroupItem
                              className="peer sr-only"
                              id={color}
                              value={color}
                            />
                            <label
                              className="border-muted peer-data-[state=checked]:bg-accent peer-data-[state=checked]:border-muted-foreground flex size-8 items-center justify-center rounded-md border-2 p-1"
                              htmlFor={color}>
                              <div
                                className={cn(
                                  'size-full rounded-xs',
                                  ISSUE_TYPE_COLORS_BG_CLASSES[color],
                                )}
                              />
                            </label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <RadioGroup
                        className="flex items-center gap-2"
                        onValueChange={field.onChange}
                        value={field.value}>
                        {ISSUE_TYPE_ICONS.map((icon) => (
                          <div key={icon}>
                            <RadioGroupItem
                              className="peer sr-only"
                              id={icon}
                              value={icon}
                            />
                            <label
                              className="border-muted peer-data-[state=checked]:bg-accent peer-data-[state=checked]:border-muted-foreground flex size-8 items-center justify-center rounded-md border-2 p-1"
                              htmlFor={icon}>
                              {getIssueIcon({ icon })}
                            </label>
                          </div>
                        ))}
                      </RadioGroup>
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
