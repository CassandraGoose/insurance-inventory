"use client";
import dynamic from "next/dynamic";
import Link from "next/link";

const SignInForm = dynamic(
  async () => {
    const authUI = await import("@neondatabase/auth-ui");
    return authUI.SignInForm;
  },
  { ssr: false },
);

export default function SignInPage() {
  return (
    <main className="container mx-auto w-full flex flex-col items-center justify-center self-center my-10">
      <h2 className="py-4">Welcome! Please Sign In to Continue.</h2>
      <div className="w-100 max-w-md rounded-xl bg-[#e3dfde] p-6 shadow-sm ">
        <SignInForm
          localization={{ SIGN_IN: "Welcome Back!" }}
          redirectTo="/items"
          classNames={{ input: "bg-[#f5f5f5] dark:bg-[#f5f5f5]" }}
        />
        <p className="pt-4 text-small">
          Don&apos;t have an account?
          <Link className="text-[#696eb5] pl-2" href="/auth/sign-up">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
