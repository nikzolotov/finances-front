import "./total.css";

export const Total = ({ title, value, average, averageYear, type, invert }) => {
  return (
    <div className="total card">
      <h2 className="total__title">{title}</h2>
      <p className="total__value">
        {value.toLocaleString("ru-RU", {
          maximumFractionDigits: 2,
        })}
        {type === "percent" ? "%" : ""}
      </p>
      {average !== undefined && (
        <AverageDifference
          value={value}
          average={average}
          averageYear={averageYear}
          invert={invert}
        />
      )}
    </div>
  );
};

const AverageDifference = ({ value, average, averageYear, invert }) => {
  const difference = (value / average - 1) * 100;

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
      {difference > 0 ? "+" : ""}
      {difference.toLocaleString("ru-RU", {
        maximumFractionDigits: 2,
      })}
      % к среднему за {averageYear}
    </p>
  );
};
