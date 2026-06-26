"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import loginImg from "./../assets/img/login-img.jpg";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginCredentials } from "../types";
import { useLogin } from "../hooks/useLogin";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { mutate: loginMutate, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = (data: LoginCredentials) => {
    loginMutate(data, {
      onError: (error: any) => {
        const backendMessage = error.response?.data?.message;
        const backendErrors = error.response?.data?.errors;

        if (backendErrors) {
          const errorMsg = Object.values(backendErrors).flat().join(" ");
          toast.error(errorMsg || "Credenciales incorrectas.");
        } else {
          toast.error(
            backendMessage ||
              "Error al conectar con el servidor. Intenta de nuevo."
          );
        }
      },
    });
  };

  return (
    <div
      className={cn("flex flex-col gap-6 font-montserrat", className)}
      {...props}
    >
      <Card className="overflow-hidden p-0 border-zinc-200 dark:border-zinc-800">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 md:p-8 flex flex-col justify-center"
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-montserrat">
                  Bienvenido
                </h1>
                <p className="text-balance text-sm text-zinc-500 dark:text-zinc-400 font-montserrat">
                  Ingresa tus credenciales para acceder a la plataforma.
                </p>
              </div>

              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email" className="font-montserrat">
                  Correo Electrónico
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  className={cn(
                    "font-montserrat",
                    errors.email &&
                      "border-destructive focus-visible:ring-destructive"
                  )}
                  disabled={isPending}
                  {...register("email")}
                />
                <FieldError errors={[errors.email]} />
              </Field>

              <Field data-invalid={!!errors.password}>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" className="font-montserrat">
                    Contraseña
                  </FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className={cn(
                    "font-montserrat",
                    errors.password &&
                      "border-destructive focus-visible:ring-destructive"
                  )}
                  disabled={isPending}
                  {...register("password")}
                />
                <FieldError errors={[errors.password]} />
              </Field>

              <Field>
                <Button
                  type="submit"
                  disabled={!isValid || isPending}
                  className="w-full bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 active:scale-95 transition-transform font-montserrat font-semibold"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-zinc-100 dark:bg-zinc-900 md:block">
            <Image
              src={loginImg}
              alt="Estancia ganadera Llanos"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.3] dark:grayscale"
              priority
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center text-xs text-zinc-500 dark:text-zinc-400 font-montserrat">
        Sistema de Gestión de Fincas (FMS) &copy; {new Date().getFullYear()}
      </FieldDescription>
    </div>
  );
}
