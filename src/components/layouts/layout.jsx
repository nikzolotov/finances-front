import { Link, useParams } from "react-router-dom";

import "./layout.css";
import logo from "../../assets/logo.svg";
import nik from "../../assets/nikita.jpg";
import nastya from "../../assets/nastya.jpg";
import lev from "../../assets/lev.jpg";

export const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
};

const Header = () => {
  return (
    <header>
      <Link to="/">
        <img className="logo" src={logo} alt="Finances" />
      </Link>
      <Breadcrumbs year={useParams().year} month={useParams().month} />
      <Avatars />
    </header>
  );
};

const Avatars = () => {
  return (
    <div className="avatars">
      <Avatar image={nik} />
      <Avatar image={nastya} />
      <Avatar image={lev} />
    </div>
  );
};

const Breadcrumbs = ({ year, month }) => {
  const breadcrumbs = [];

  if (year !== undefined) {
    breadcrumbs.push({
      title: "Все финансы",
      link: "/",
    });
    breadcrumbs.push({
      title: year,
      link: `/report/${year}`,
    });
  }

  if (month !== undefined) {
    const monthName = new Intl.DateTimeFormat("ru", { month: "long" }).format(
      new Date(year, month - 1)
    );
    breadcrumbs.push({
      title: monthName,
      link: `/report/${year}/${month}`,
    });
  }

  return (
    <ul className="breadcrumbs">
      {breadcrumbs.map(({ title, link }, index) => (
        <li key={index} className="breadcrumbs__item capitalize">
          {index === breadcrumbs.length - 1 ? (
            title
          ) : (
            <Link to={link} className="breadcrumbs__link">
              {title}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
};

const Avatar = ({ image }) => {
  return <img className="avatar" src={image} alt="Avatar" />;
};
