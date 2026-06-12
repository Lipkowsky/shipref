import { Link, Navigate } from "react-router";
import { useAuth } from "@clerk/clerk-react";

export default function IndexPage() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null; // albo loader

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold">This is the index page</h1>

      <ul>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
      </ul>
    </div>
  );
}