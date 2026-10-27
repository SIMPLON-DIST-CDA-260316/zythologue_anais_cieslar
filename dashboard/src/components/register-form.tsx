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
import {registerSchema} from "@/lib/validations.ts";
import {Eye, EyeOff} from "lucide-react";
import {Link, useNavigate} from "react-router";

type RegisterFieldErrors = {
  first_name?: string[]
  last_name?: string[]
  email?: string[]
  password?: string[]
  confirm_password?: string[]
}

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({})
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const navigate = useNavigate()

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setFieldErrors({})
    const formData = new FormData(event.currentTarget)
    const result = registerSchema.safeParse({
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirm_password: formData.get("confirm_password"),
    })

    if (!result.success) {
      setFieldErrors(z.flattenError(result.error).fieldErrors)
      return
    }

    // confirm_password ne sert qu'au front, on ne l'envoie pas à l'API
    const user = {
      first_name: result.data.first_name,
      last_name: result.data.last_name,
      email: result.data.email,
      password: result.data.password,
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.message)
        return
      }

      navigate("/login", { state: { registered: true } })
    } catch {
      setError("Impossible de contacter le serveur")
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} noValidate>
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="first_name">First name</FieldLabel>
                  <Input id="first_name" name="first_name" placeholder="Marie" />
                  <FieldError>{fieldErrors.first_name?.[0]}</FieldError>
                </Field>
                <Field>
                  <FieldLabel htmlFor="last_name">Last name</FieldLabel>
                  <Input id="last_name" name="last_name" placeholder="Dupont" />
                  <FieldError>{fieldErrors.last_name?.[0]}</FieldError>
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                />
                <FieldError>{fieldErrors.email?.[0]}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} name="password" className="pr-10" />
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
                <FieldLabel htmlFor="confirm_password">Confirm password</FieldLabel>
                <Input id="confirm_password" type={showPassword ? "text" : "password"} name="confirm_password" />
                <FieldError>{fieldErrors.confirm_password?.[0]}</FieldError>
              </Field>
              <Field>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit">Create account</Button>
                <FieldDescription className="text-center">
                  Already have an account? <Link to="/login">Login</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
