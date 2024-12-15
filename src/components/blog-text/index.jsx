import "./blog-text.css";

export const BlogText = ({
  expenses,
  income,
  totalIncome,
  totalExpenses,
  savings,
  savingsRate,
}) => {
  return (
    <div className="blog-text card">
      <h2 className="blog-text__title2">Текст для блога</h2>
      <h3 className="blog-text__title3">
        Расходы — {totalExpenses.toLocaleString("ru-RU")} ₽
      </h3>
      <CategoryList data={expenses} />
      <p> </p>
      <h3 className="blog-text__title3">
        Доходы — {totalIncome.toLocaleString("ru-RU")} ₽
      </h3>
      <CategoryList data={income} />
      <p> </p>
      <h3 className="blog-text__title3">Итого</h3>
      <TotalList savings={savings} savingsRate={savingsRate} />
    </div>
  );
};
export const CategoryList = ({ data }) => {
  return (
    <ul className="blog-text__list">
      {data && data.length > 0 ? (
        data.map((expense) => (
          <li className="blog-text__item" key={expense.id}>
            • {expense.category.name} — {expense.sum.toLocaleString("ru-RU")} ₽
          </li>
        ))
      ) : (
        <li className="blog-text__item blog-text__empty">Пусто</li>
      )}
    </ul>
  );
};

export const TotalList = ({ savings, savingsRate }) => {
  return (
    <ul className="blog-text__list">
      <li className="blog-text__item">
        • Процент сохранений —{" "}
        {savingsRate.toLocaleString("ru-RU", { maximumFractionDigits: 2 })}%
      </li>
      <li className="blog-text__item">
        • Cохранили — {savings.toLocaleString("ru-RU")} ₽
      </li>
    </ul>
  );
};
