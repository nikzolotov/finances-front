import { Link } from "react-router-dom";
import "./report-links.css";

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
