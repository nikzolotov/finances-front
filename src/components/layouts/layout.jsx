import { Link } from "react-router-dom";

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

const Avatar = ({ image }) => {
  return <img className="avatar" src={image} alt="Avatar" />;
};
