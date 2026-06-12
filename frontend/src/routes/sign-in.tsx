import { SignIn } from '@clerk/clerk-react'

export default function SignInPage() {
  return (
  <div className="flex min-h-screen flex-col items-center justify-center p-4">
    <SignIn />
  </div>
  )
}