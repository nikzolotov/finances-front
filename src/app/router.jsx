import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppRoot } from "./routes/root";
import { HomeRoute, homeLoader } from "./routes/home";
import { AnnualReportRoute, AnnualReportLoader } from "./routes/report-annual";
import {
  MonthlyReportRoute,
  MonthlyReportLoader,
} from "./routes/report-monthly";

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
      {
        path: "report/:year",
        element: <AnnualReportRoute />,
        loader: AnnualReportLoader,
      },
      {
        path: "report/:year/:month",
        element: <MonthlyReportRoute />,
        loader: MonthlyReportLoader,
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
