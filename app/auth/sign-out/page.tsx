import { SignOut } from "@neondatabase/auth-ui";

export default function SignOutPage() {
  return <SignOut redirectTo="/auth/sign-in" />;
}
