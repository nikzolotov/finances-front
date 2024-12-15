import "./total.css";

export const Total = ({ title, value, type }) => {
  return (
    <div className="total card">
      <h2 className="total__title">{title}</h2>
      <p className="total__value">
        {value.toLocaleString("ru-RU", {
          maximumFractionDigits: 2,
        })}
        {type === "percent" ? "%" : ""}
      </p>
    </div>
  );
};
