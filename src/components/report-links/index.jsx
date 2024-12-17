import { Link } from "react-router-dom";
import "./report-links.css";

// Просто выводит ссылки на 12 месяцев
export const MonthLinks = ({ year }) => {
  return (
    <ul className="report-links">
      {Array.from({ length: 12 }, (_, i) => (
        <li key={i + 1} className="report-links__item">
          <Link
            to={`/report/${year}/${(i + 1).toString().padStart(2, "0")}`}
            className="button"
          >
            <span className="capitalize">
              {new Intl.DateTimeFormat("ru", { month: "long" }).format(
                new Date(year, i)
              )}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

// Выводит ссылки на годы с 2017 по текущий
export const YearLinks = () => {
  const firstYear = 2017;
  const yearsSince2017 = new Date().getFullYear() - firstYear;

  return (
    <ul className="report-links">
      {Array.from({ length: yearsSince2017 + 1 }, (_, i) => (
        <li key={i + firstYear} className="report-links__item">
          <Link to={`/report/${(i + firstYear).toString()}`} className="button">
            <span className="capitalize">{(i + firstYear).toString()}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};
