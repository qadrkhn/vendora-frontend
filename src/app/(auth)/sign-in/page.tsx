import LoginForm from '@/components/Login/LoginForm';

export default function SignInPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to sign in
        </p>
      </div>
      <LoginForm />
      <p className="text-sm text-center text-muted-foreground">
        Don't have an account?{' '}
        <a href="/sign-up" className="font-medium text-blue-600 hover:underline">
          Sign Up
        </a>
      </p>
    </div>
  );
}
