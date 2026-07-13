import type { Metadata } from "next";
import { authClient } from "@/lib/auth/client";
import { NeonAuthUIProvider, UserButton } from "@neondatabase/auth-ui";
import { Philosopher, Mulish } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const headerFont = Philosopher({
  weight: "700",
  variable: "--font-header",
  subsets: ["latin"],
});

const bodyFont = Mulish({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Insurance Inventory",
  description: "This app let's you track insurance for claims and adjustments.",
  icons: { icon: "/logo.svg" },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${headerFont.variable} h-full antialiased`}
      suppressHydrationWarning
      // need to suppress warning due to the way neonauthuiprovider works
    >
      <body className="min-h-full flex flex-col">
        <NeonAuthUIProvider
          authClient={authClient}
          emailOTP
          credentials={{ forgotPassword: false }}
          social={{ providers: ["google"] }}
          className="bg-[#f5f5f5] text-[#292f36] flex flex-col flex-1"
        >
          <header className="flex h-16 items-center justify-between border-b p-4">
            <nav>
              <Link href="/items" className="flex justify-between items-center space-x-2">
                <img src="/logo.svg" alt="Logo" className="h-12 w-auto" />
                <h1 className="text-3xl font-bold">Inventory Items</h1>
              </Link>
            </nav>
            <UserButton
              disableDefaultLinks
              size={"icon"}
              className="bg-white text-black"
              classNames={{
                trigger: {
                  avatar: {
                    fallback: "bg-[#292f36] text-white",
                  },
                },
              }}
            />
          </header>
          <div className="flex-1">{children}</div>
          <footer className="text-[#696eb5] bg-[#e3dfde] py-6 px-10 text-small">
            <p className="py-4">Insurance Inventory 2026</p>
            <p>
              Logo Attribution: &quot;home insurance by Iwan Setyo from Noun Project&quot; (CC BY
              3.0)
            </p>
          </footer>
        </NeonAuthUIProvider>
      </body>
    </html>
  );
}
