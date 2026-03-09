import { valibotResolver } from '@hookform/resolvers/valibot'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { generatePath, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import * as v from 'valibot'

import type { Project } from '@/domain/types.ts'
import type { CreateIssueType } from '@/features/issue-types/actions.ts'
import type { GetCurrentUserRole } from '@/features/memberships/actions.ts'

import {
  getIssueIcon,
  ISSUE_TYPE_COLORS,
  ISSUE_TYPE_COLORS_BG_CLASSES,
  ISSUE_TYPE_ICONS,
} from '@/shared/constants/issue-constants.tsx'
import { getInfraErrorMessage } from '@/shared/result.ts'
import { LoadingState } from '@/ui/components/loading-state'
import { useCreateIssueTypeMutation } from '@/ui/query-hooks/issue-types/create-issue-type'
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
import { Label } from '@/ui/shadcn/components/ui/label.tsx'
import {
  RadioGroup,
  RadioGroupItem,
} from '@/ui/shadcn/components/ui/radio-group.tsx'
import { cn } from '@/ui/shadcn/lib/utils.ts'

const createTypeSchema = v.object({
  color: v.picklist(ISSUE_TYPE_COLORS),
  icon: v.picklist(ISSUE_TYPE_ICONS),
  name: v.pipe(v.string(), v.minLength(1, 'Issue type name is required')),
})

type CreateTypeFormValues = v.InferOutput<typeof createTypeSchema>

export function CreateIssueTypePage({
  deps,
  projectId,
}: {
  deps: {
    createIssueType: CreateIssueType
    getCurrentUserRole: GetCurrentUserRole
  }
  projectId: Project['id']
}) {
  const navigate = useNavigate()
  const { data: currentUserRoleResult, isLoading } = useCurrentUserRoleQuery(
    projectId,
    deps.getCurrentUserRole,
  )
  const { isPending: isCreating, mutate: createType } =
    useCreateIssueTypeMutation(deps.createIssueType)
  const currentUserRole = currentUserRoleResult?.ok
    ? currentUserRoleResult.value
    : null

  const form = useForm<CreateTypeFormValues>({
    defaultValues: {
      color: ISSUE_TYPE_COLORS[0],
      icon: ISSUE_TYPE_ICONS[0],
      name: '',
    },
    mode: 'onBlur',
    resolver: valibotResolver(createTypeSchema),
  })

  const goBack = () =>
    navigate(generatePath(ROUTES.PROJECT_SETTINGS_ISSUE_TYPES, { projectId }))

  const onSubmit = (values: CreateTypeFormValues) => {
    createType(
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
          toast.success('Issue type created successfully')
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
                            <Label
                              className="border-muted peer-data-[state=checked]:bg-accent peer-data-[state=checked]:border-muted-foreground flex size-8 items-center justify-center rounded-md border-2 p-1"
                              htmlFor={color}>
                              <div
                                className={cn(
                                  'size-full rounded-xs',
                                  ISSUE_TYPE_COLORS_BG_CLASSES[color],
                                )}
                              />
                            </Label>
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
                            <Label
                              className="border-muted peer-data-[state=checked]:bg-accent peer-data-[state=checked]:border-muted-foreground flex size-8 items-center justify-center rounded-md border-2 p-1"
                              htmlFor={icon}>
                              {getIssueIcon({ icon })}
                            </Label>
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
