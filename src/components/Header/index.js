import React from "react";
import Logo from "../../assets/img/geekup-logo.svg";
import "./index.css";

const Header = () => {
    return (
        <header className="container">
            <div className="header">
                <img className="img-Logo" src={Logo} alt="Logo" />
                <h4 className="header-title">Nguyen Huu Tien</h4>
                <h4 className="header-title">Todo List</h4>
            </div>
        </header>
    );
};

export default Header;
