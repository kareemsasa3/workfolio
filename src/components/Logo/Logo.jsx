import React from 'react';
import logo from '../../assets/logo.svg';
import './Logo.css';

const Logo = () => {
    return (
        <div>
            <img src={logo} className="logo" alt="logo" />
        </div>
    );
};

export default Logo;
