import { LoginForm } from "@/features/auth/components/login-form";
import { GuestGuard } from "@/features/auth/components/guest-guard";

export default function LoginPage() {
  return (
    <GuestGuard>
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-4xl">
          <LoginForm />
        </div>
      </div>
    </GuestGuard>
  );
}
