import { valibotResolver } from '@hookform/resolvers/valibot'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as v from 'valibot'

import type { GetCurrentUser, UpdateUser } from '@/features/users/actions.ts'

import { getInfraErrorMessage } from '@/shared/result.ts'
import { LoadingState } from '@/ui/components/loading-state'
import { useUserQuery } from '@/ui/query-hooks/users/get-current-user'
import { useUpdateUserMutation } from '@/ui/query-hooks/users/update-user'
import { Button } from '@/ui/shadcn/components/ui/button'
import {
  Card,
  CardContent,
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

const userInfoSchema = v.object({
  email: v.pipe(v.string(), v.email('Invalid email')),
  name: v.pipe(v.string(), v.minLength(1, 'Enter your name')),
})

type UserInfoFormValues = v.InferOutput<typeof userInfoSchema>

export function UserPage({
  deps,
}: {
  deps: {
    getCurrentUser: GetCurrentUser
    updateUser: UpdateUser
  }
}) {
  const { data: userResult, isLoading } = useUserQuery(deps.getCurrentUser)
  const { isPending: isSaving, mutate } = useUpdateUserMutation(deps.updateUser)

  const user = userResult?.ok ? userResult.value : null
  const loadError = userResult && !userResult.ok ? userResult.error.message : ''

  const form = useForm<UserInfoFormValues>({
    defaultValues: { email: '', name: '' },
    mode: 'onBlur',
    resolver: valibotResolver(userInfoSchema),
  })

  useEffect(() => {
    if (user) {
      form.reset(user)
    }
  }, [user, form])

  useEffect(() => {
    if (loadError) {
      form.setError('root', { message: loadError })
    }
  }, [loadError, form])

  const onSubmit = (values: UserInfoFormValues) => {
    mutate(
      { name: values.name },
      {
        onSuccess: (res) => {
          if (!res.ok) {
            form.setError('root', {
              message: getInfraErrorMessage(res.error),
            })
            return
          }

          form.reset(res.value)
          toast.success('User info updated successfully')
        },
      },
    )
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>User info</CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <LoadingState />
          ) : (
            <Form {...form}>
              <form
                className="space-y-6"
                data-testid="user-form"
                noValidate
                onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          data-testid="input-name"
                          placeholder="Your name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage data-testid="error-name" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          data-testid="input-email"
                          placeholder="you@example.com"
                          readOnly
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage data-testid="error-email" />
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
                    data-testid="btn-save"
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
                    onClick={() => form.reset(user ?? undefined)}
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
    </section>
  )
}
