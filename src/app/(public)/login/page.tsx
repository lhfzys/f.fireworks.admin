import { LoginForm } from '@/features/auth/login-form';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <LoginForm />
    </main>
  );
}
