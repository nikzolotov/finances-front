import "./card.css";

export const Card = ({ title, cutoff, children }) => {
  return (
    <div className="card">
      {title && <CardHeader title={title} />}
      {cutoff ? <div className="card__cutoff">{children}</div> : children}
    </div>
  );
};

export const CardHeader = ({ title, children }) => {
  return (
    <div className="card__header">
      {title && <CardTitle title={title} />}
      {children}
    </div>
  );
};

const CardTitle = ({ title }) => {
  return <h2 className="card__title">{title}</h2>;
};
