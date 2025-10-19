import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { Button } from '@/ui/shadcn/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/shadcn/components/ui/card'
import { Input } from '@/ui/shadcn/components/ui/input'
import { Label } from '@/ui/shadcn/components/ui/label'
import { cn } from '@/ui/shadcn/lib/utils'

type LoginFormInputs = {
  email: string
  password: string
}

export function LoginForm({
  className,
  error,
  onLogin,
  ...props
}: React.ComponentProps<'div'> & {
  error?: null | string
  onLogin: (email: string, password: string) => void
}) {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: 'alice@example.com',
      password: '1',
    },
  })

  const handleFormSubmit = (data: LoginFormInputs) => {
    onLogin(data.email, data.password)
  }

  return (
    <div
      className={cn('flex flex-col gap-6', className)}
      {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="flex flex-col gap-6">
              {error && <div className="text-destructive text-sm">{error}</div>}
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  {...register('email', { required: 'Email is required' })}
                  placeholder="alice@example.com"
                  type="email"
                />
                {errors.email && (
                  <span className="text-destructive text-sm">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    to="#">
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  {...register('password', {
                    required: 'Password is required',
                  })}
                  placeholder="1"
                  type="password"
                />
                {errors.password && (
                  <span className="text-destructive text-sm">
                    {errors.password.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  className="w-full"
                  type="submit">
                  Login
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link
                className="underline underline-offset-4"
                to="/register">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
