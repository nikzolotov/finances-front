import "./chart-tooltip.css";

export const ChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const date = new Date(label);
    const monthName = new Intl.DateTimeFormat("ru", {
      month: "long",
    }).format(date);

    return (
      <div className="tooltip">
        <h3 className="tooltip__title capitalize">
          {monthName} {date.getFullYear()}
        </h3>
        <ul className="tooltip__items">
          {payload.map((item) => (
            <li
              className="tooltip__item"
              key={item.name}
              style={{ display: item.value === 0 ? "none" : undefined }}
            >
              {item.name !== "value" && (
                <span className="tooltip__label">
                  <span
                    className="tooltip__color"
                    style={{ background: item.fill }}
                  ></span>
                  {item.name}
                </span>
              )}
              <span className="tooltip__value">
                {item.value.toLocaleString("ru-RU", {
                  maximumFractionDigits: 0,
                })}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
};
