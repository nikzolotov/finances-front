import "./segmented-control.css";

export const SegmentedControl = ({ value, onChange, items }) => {
  return (
    <div className="segmented-control">
      {items.map((item) => (
        <button
          key={item.value}
          className={`segmented-control__item${
            item.value === value ? " segmented-control__item-active" : ""
          }`}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};
