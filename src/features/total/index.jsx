import "./total.css";

export const Total = ({ title, value, type, children }) => {
  return (
    <div className="total card">
      <h2 className="total__title">{title}</h2>
      <p className="total__value">
        {value.toLocaleString("ru-RU", {
          maximumFractionDigits: type === "percent" ? 2 : 0,
        })}
        {type === "percent" ? "%" : ""}
      </p>
      {children}
    </div>
  );
};

export const Difference = ({
  value,
  comparisonValue,
  label,
  labelNoData,
  invert,
}) => {
  if (comparisonValue !== 0) {
    const difference = (value / comparisonValue - 1) * 100;

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
        {formatDifference(difference)} {label}
      </p>
    );
  }
  return <p className="total__difference total__empty">{labelNoData}</p>;
};

const formatDifference = (difference) => {
  const sign = difference > 0 ? "+" : "";
  return `${sign}${difference.toLocaleString("ru-RU", {
    maximumFractionDigits: 2,
  })}%`;
};
