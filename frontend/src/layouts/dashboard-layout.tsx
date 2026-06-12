import { Outlet, Navigate } from "react-router"; // 1. Importujemy Navigate
import { useUser } from "../context/UserContext";

export default function DashboardLayout() {
  const { loading, user } = useUser();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Ładowanie danych...
      </div>
    );
  }

  
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
}