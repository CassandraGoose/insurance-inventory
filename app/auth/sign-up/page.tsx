"use client";
import dynamic from "next/dynamic";
import Link from "next/link";

const SignUpForm = dynamic(() => import("@neondatabase/auth-ui").then((m) => m.SignUpForm), {
  ssr: false,
});

export default function SignUpPage() {
  return (
    <main className="container mx-auto flex my-10 flex-col items-center justify-center self-center">
      <h2 className="py-4">Welcome! Please Sign Up to Continue.</h2>
      <div className="max-w-md rounded-xl bg-[#e3dfde] p-6 shadow-sm">
        <SignUpForm
          classNames={{ input: "bg-[#f5f5f5] dark:bg-[#f5f5f5]" }}
          localization={{ SIGN_UP: "Create an Account" }}
          redirectTo="/items"
        />
        <p className="pt-4 text-small">
          Already have an account?
          <Link className="text-[#696eb5] pl-2" href="/auth/sign-in">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
