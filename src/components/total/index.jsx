import "./total.css";

export const Total = ({
  title,
  value,
  yearAgo,
  average,
  averageYear,
  type,
  invert,
}) => {
  return (
    <div className="total card">
      <h2 className="total__title">{title}</h2>
      <p className="total__value">
        {value.toLocaleString("ru-RU", {
          maximumFractionDigits: 2,
        })}
        {type === "percent" ? "%" : ""}
      </p>
      {yearAgo !== undefined && (
        <Difference
          value={value}
          comparisonValue={yearAgo}
          label="чем годом ранее"
          invert={invert}
        />
      )}
      {average !== undefined && (
        <Difference
          value={value}
          comparisonValue={average}
          label={`к среднему за ${averageYear}`}
          invert={invert}
        />
      )}
    </div>
  );
};

const Difference = ({ value, comparisonValue, label, invert }) => {
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
};

const formatDifference = (difference) => {
  const sign = difference > 0 ? "+" : "";
  return `${sign}${difference.toLocaleString("ru-RU", {
    maximumFractionDigits: 2,
  })}%`;
};
