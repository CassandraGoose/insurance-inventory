'use client'
import dynamic from 'next/dynamic'

const SignUpForm = dynamic(() => import('@neondatabase/auth-ui').then((m) => m.SignUpForm), {
  ssr: false,
})

export default function SignUpPage() {
  return (
    <main className="container mx-auto flex grow flex-col items-center justify-center gap-3 self-center p-4 md:p-6">
      <SignUpForm localization={{ SIGN_UP: 'Create an Account' }} />
    </main>
  )
}
