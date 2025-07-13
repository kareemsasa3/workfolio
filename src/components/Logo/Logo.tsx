import logo from "../../assets/logo.svg";
import "./Logo.css";

const Logo = ({ small = false }: { small?: boolean }) => {
  return (
    <div>
      <img
        src={logo}
        className={small ? "logo logo-small" : "logo"}
        alt="logo"
      />
    </div>
  );
};

export default Logo;
