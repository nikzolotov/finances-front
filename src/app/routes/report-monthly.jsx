import { useLoaderData } from "react-router-dom";

export const MonthlyReportLoader = async ({ params }) => {
  return {
    year: params.year,
    month: params.month,
  };
};

export const MonthlyReportRoute = () => {
  const { year, month } = useLoaderData();
  return (
    <div>
      Monthly Report {month}.{year}
    </div>
  );
};
