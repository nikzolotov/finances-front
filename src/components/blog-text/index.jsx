import "./blog-text.css";

export const BlogText = ({ expenses, income }) => {
  return (
    <div className="blog-text card">
      <h2 className="blog-text__title2">Текст для блога</h2>
      <h3 className="blog-text__title3">Расходы</h3>
      <CategoryList data={expenses} />
      <h3 className="blog-text__title3">Доходы</h3>
      <CategoryList data={income} />
      <h3 className="blog-text__title3">Итого</h3>
    </div>
  );
};
export const CategoryList = ({ data }) => {
  return (
    <ul className="blog-text__list">
      {data && data.length > 0 ? (
        data.map((expense) => (
          <li className="blog-text__item" key={expense.id}>
            - {expense.category.name} — {expense.sum.toLocaleString("ru-RU")} ₽
          </li>
        ))
      ) : (
        <li className="blog-text__item blog-text__empty">Пусто</li>
      )}
    </ul>
  );
};
