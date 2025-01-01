import {
  budgetColor,
  savingsColor,
} from "../../components/recharts/color-schemes";
import "./chart-tooltip.css";

export const TimelineTooltip = ({ active, payload, label }) => {
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
        <ul
          className={`tooltip__items${
            payload.length > 10 ? " tooltip__items--long" : ""
          }`}
        >
          {payload.map((item) => (
            <TooltipLine key={item.name} item={item} hideEmpty />
          ))}
        </ul>
      </div>
    );
  }

  return null;
};

export const SavingsTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const date = new Date(label);
    const monthName = new Intl.DateTimeFormat("ru", {
      month: "long",
    }).format(date);

    const incomeItem = payload.filter((item) => item.dataKey === "income")[0];
    const expensesItem = payload.filter(
      (item) => item.dataKey === "expenses"
    )[0];
    const savingsItem = payload.filter((item) => item.dataKey === "savings")[0];

    const savingsColorValue =
      savingsItem.value >= 0 ? savingsColor[0] : savingsColor[1];

    return (
      <div className="tooltip">
        <h3 className="tooltip__title capitalize">
          {monthName} {date.getFullYear()}
        </h3>
        <ul className="tooltip__items">
          <TooltipLine
            key="income"
            item={{
              name: incomeItem.name,
              value: incomeItem.value,
              fillClass: "tooltip__bg-bar", // чтобы цвет менялся в зависимости от темы
            }}
          />
          <TooltipLine
            key="expenses"
            item={{
              name: expensesItem.name,
              value: expensesItem.value,
              fillClass: "tooltip__bg-bar", // чтобы цвет менялся в зависимости от темы
            }}
          />
          <TooltipLine
            key="savings"
            item={{
              name: savingsItem.name,
              value: savingsItem.value,
              fill: savingsColorValue,
            }}
          />
        </ul>
      </div>
    );
  }

  return null;
};

export const CategoryTooltip = ({ active, payload, label, annual }) => {
  if (active && payload && payload.length) {
    const sumItem = payload.filter((item) => item.dataKey === "sum")[0];
    const budgetItem = payload.filter((item) => item.dataKey === "budget")[0];
    const overBudget = sumItem.value - budgetItem.value;

    const sumColor =
      overBudget > 0
        ? `linear-gradient(0deg, ${budgetColor[0]} 0%, ${budgetColor[0]} 50%, ${budgetColor[1]} 50%, ${budgetColor[1]} 100%)`
        : budgetColor[0];
    const budgetColorOpacity = overBudget > 0 ? 1 : 0.2;

    return (
      <div className="tooltip">
        <h3 className="tooltip__title">{label}</h3>
        <ul className={`tooltip__items`}>
          <TooltipLine
            key="sum"
            item={{
              name: annual ? "Среднее" : "Факт",
              value: sumItem.value,
              fill: sumColor,
            }}
          />
          <TooltipLine
            key="budget"
            item={{
              name: "Бюджет",
              value: budgetItem.value,
              fill: budgetColor[0],
              opacity: budgetColorOpacity,
            }}
          />
          {overBudget > 0 && (
            <TooltipLine
              key="over-budget"
              item={{
                name: "Превышение",
                value: overBudget,
                fill: budgetColor[1],
              }}
            />
          )}
        </ul>
      </div>
    );
  }

  return null;
};

const TooltipLine = ({ item, hideEmpty = false }) => {
  return (
    <li
      className="tooltip__item"
      style={{ display: hideEmpty && item.value === 0 ? "none" : undefined }}
    >
      {item.name !== "value" && (
        <span className="tooltip__label">
          <span
            className={`tooltip__color ${item.fillClass}`}
            style={{ background: item.fill, opacity: item.opacity }}
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
  );
};
