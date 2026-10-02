import { cn } from "@/lib/utils"
import {Button} from "@/components/ui/button";
import { z } from "zod"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {useState} from "react";
import {loginSchema} from "@/lib/validations.ts";
import {Eye, EyeOff} from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ email?: string[]; password?: string[] }>({})
  const [showPassword, setShowPassword] = useState<boolean>(false)

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setFieldErrors({})
    const formData = new FormData(event.currentTarget)
    const email = formData.get("email")
    const password = formData.get("password")
    const result = loginSchema.safeParse({ email, password})

    if (!result.success) {
      setFieldErrors(z.flattenError(result.error).fieldErrors)
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.message)
        return
      }

      localStorage.setItem("token", data.token)
    } catch {
      setError("Impossible de contacter le serveur")
    }
  }



  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} noValidate>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                />
                <FieldError>{fieldErrors.email?.[0]}</FieldError>
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  {/*<a*/}
                  {/*  href="#"*/}
                  {/*  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"*/}
                  {/*>*/}
                  {/*  Forgot your password?*/}
                  {/*</a>*/}
                </div>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} name="password" required className="pr-10" />
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>

                <FieldError>{fieldErrors.password?.[0]}</FieldError>
              </Field>
              <Field>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit">Login</Button>
                {/*<Button variant="outline" type="button">*/}
                {/*  Login with Google*/}
                {/*</Button>*/}
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="#">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
