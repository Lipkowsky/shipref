import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import SignInPage from "./routes/sign-in.tsx";
import SignUpPage from "./routes/sign-up.tsx";
import DashboardLayout from "./layouts/dashboard-layout.tsx";
import DashboardPage from "./routes/dashboard.tsx";
import IndexPage from "./routes/index.tsx";
import RootLayout from "./layouts/root-layout.tsx";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <IndexPage /> },
      { path: "/sign-in", element: <SignInPage /> },
      { path: "/sign-up", element: <SignUpPage /> },
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [{ index: true, element: <DashboardPage /> }],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
