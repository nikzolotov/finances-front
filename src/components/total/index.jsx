import "./total.css";

export const Total = ({ title, value }) => {
  return (
    <div className="total card">
      <h2 className="total__title">{title}</h2>
      <p className="total__value">{value}</p>
    </div>
  );
};
