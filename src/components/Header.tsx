import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Header = () => {
  return (
    <header>
      <div>
        <FontAwesomeIcon className="header-icon" icon={"list"} />
        <h1>Todo List</h1>
      </div>
    </header>
  );
};

export default Header;
