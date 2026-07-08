'use client'
import dynamic from 'next/dynamic'

const SignInForm = dynamic(() => import('@neondatabase/auth-ui').then((m) => m.SignInForm), {
  ssr: false,
})

export default function SignInPage() {
  return (
    <main className="container mx-auto flex grow flex-col items-center justify-center gap-3 self-center p-4 md:p-6">
      <SignInForm localization={{ SIGN_IN: 'Welcome Back!' }} />
    </main>
  )
}
