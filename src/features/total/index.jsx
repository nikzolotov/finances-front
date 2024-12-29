import "./total.css";

export const Total = ({ title, value, percent = false, children }) => {
  return (
    <div className="total card">
      <h2 className="total__title">{title}</h2>
      <p className="total__value">
        {value.toLocaleString("ru-RU", {
          maximumFractionDigits: percent ? 2 : 0,
        })}
        {percent ? "%" : ""}
      </p>
      {children}
    </div>
  );
};

export const Difference = ({
  value,
  comparisonValue,
  label,
  labelNoData = "Нет данных",
  invert = false,
  absolute = false,
  percent = false,
}) => {
  if (comparisonValue !== 0 && !Number.isNaN(comparisonValue)) {
    const difference =
      absolute || percent
        ? value - comparisonValue
        : (value / comparisonValue - 1) * 100;

    return (
      <p
        className={`total__difference ${
          difference > 0
            ? invert
              ? "total__negative"
              : "total__positive"
            : invert
            ? "total__positive"
            : "total__negative"
        }`}
      >
        {formatDifference(difference, absolute)} {label}
      </p>
    );
  }
  return <p className="total__difference total__empty">{labelNoData}</p>;
};

const formatDifference = (difference, absolute) => {
  const sign = difference > 0 ? "+" : "";

  if (absolute) {
    return `${sign}${(difference / 1000).toFixed(0)}K`;
  } else {
    return `${sign}${difference.toLocaleString("ru-RU", {
      maximumFractionDigits: 2,
    })}%`;
  }
};
