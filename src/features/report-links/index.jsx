import { Link } from "react-router-dom";
import "./report-links.css";

import { convertYears, convertMonths } from "@/utils/convert-data";
import { monthName } from "@/utils/ru";

// Выводит ссылки на месяцы, за которые есть данные
export const MonthLinks = ({ data, year, title }) => {
  const months = convertMonths(data);
  return (
    <>
      {title && <h2>{title}</h2>}
      <ul
        className={`report-links${
          months.length <= 4 ? " report-links-short" : ""
        }`}
      >
        {months.map((month) => {
          const monthNameNom = monthName(month - 1, "nominative", true);
          return (
            <li key={month} className="report-links__item">
              <Link to={`/report/${year}/${month}`} className="button">
                {monthNameNom}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};

// Выводит ссылки на годы, за которые есть данные
export const YearLinks = ({ data, title }) => {
  const years = convertYears(data);
  return (
    <>
      {title && <h2>{title}</h2>}
      <ul
        className={`report-links${
          years.length <= 4 ? " report-links-short" : ""
        }`}
      >
        {years.map((year) => (
          <li key={year} className="report-links__item">
            <Link to={`/report/${year}`} className="button">
              {year}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};
