import "./blog-text.css";

export const BlogText = ({
  year,
  monthName,
  expenses,
  income,
  totalIncome,
  totalExpenses,
  savings,
  savingsRate,
  assetsDifference,
}) => {
  return (
    <div className="blog-text">
      <h3 className="blog-text__title3">
        Расходы в {monthName} {year} — {totalExpenses.toLocaleString("ru-RU")} ₽
      </h3>
      <CategoryList data={expenses} />
      <h3 className="blog-text__title3">
        Доходы — {totalIncome.toLocaleString("ru-RU")} ₽
      </h3>
      <CategoryList data={income} />
      <h3 className="blog-text__title3">Итого</h3>
      <TotalList
        savings={savings}
        savingsRate={savingsRate}
        assetsDifference={assetsDifference}
      />
    </div>
  );
};
export const CategoryList = ({ data }) => {
  return (
    <ul className="blog-text__list">
      {data && data.length > 0 ? (
        data.map((expense) => (
          <li className="blog-text__item" key={expense.id}>
            {expense.category.name}&nbsp;— {expense.sum.toLocaleString("ru-RU")}
            &nbsp;₽
          </li>
        ))
      ) : (
        <li className="blog-text__item blog-text__empty">Пусто</li>
      )}
    </ul>
  );
};

export const TotalList = ({ savings, savingsRate, assetsDifference }) => {
  const updatedSavingsRate = Number.isNaN(savingsRate) ? 0 : savingsRate;
  const assetsDifferenceSign = assetsDifference > 0 ? "+" : "";

  return (
    <ul className="blog-text__list">
      <li className="blog-text__item">
        Процент сохранений&nbsp;—{" "}
        {updatedSavingsRate.toLocaleString("ru-RU", {
          maximumFractionDigits: 2,
        })}
        %
      </li>
      <li className="blog-text__item">
        Cохранили&nbsp;— {savings.toLocaleString("ru-RU")}&nbsp;₽
      </li>
      <li className="blog-text__item">
        Изменение активов за месяц&nbsp;— {assetsDifferenceSign}
        {assetsDifference.toLocaleString("ru-RU", { maximumFractionDigits: 0 })}
        &nbsp;₽
      </li>
    </ul>
  );
};
