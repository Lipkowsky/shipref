import { Link, Outlet } from "react-router";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";

import { UserProvider } from "../context/UserProvider";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <UserProvider>
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
          <div className="flex h-16 max-w-full items-center justify-between px-4">
            
            <div className="flex items-center">
              <Link
                to="/"
                className="text-xl font-bold tracking-tight text-black transition hover:opacity-80"
              >
                Shipref
              </Link>
            </div>

           
            <div className="flex items-center gap-3">
              <SignedIn>
                <UserButton />
              </SignedIn>

              <SignedOut>
                <Link
                  to="/sign-in"
                  className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 active:scale-95"
                >
                  Sign In
                </Link>
              </SignedOut>
            </div>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </UserProvider>
    </ClerkProvider>
  );
}
