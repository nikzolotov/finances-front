import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppRoot } from "./routes/root";
import { HomeRoute, homeLoader } from "./routes/home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppRoot />,
    children: [
      {
        path: "",
        element: <HomeRoute />,
        loader: homeLoader,
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
