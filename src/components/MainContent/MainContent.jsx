import React from 'react';
import './MainContent.css';
import Logo from '../Logo';
import TypeWriterText from '../TypeWriterText';

const MainContent = ({ children }) => {
    return (
        <div className="main-content">
            <Logo />
            <div className="h1-text">
                <TypeWriterText text="Kareem Sasa" delay={0} />
            </div>
            <div className="p-text">
                <TypeWriterText text="Designer & Developer" delay={0} />
            </div>            
            <div className="page-content">
                {children}
            </div>
        </div>
    );
};

export default MainContent;
