import { useLoaderData } from "react-router-dom";

export const AnnualReportLoader = async ({ params }) => {
  return {
    year: params.year,
  };
};

export const AnnualReportRoute = () => {
  const { year } = useLoaderData();
  return <div>Annual Report {year}</div>;
};
