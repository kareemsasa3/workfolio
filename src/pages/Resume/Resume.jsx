import React from 'react';
import './Resume.css';
import resume from '../../assets/resume.png';

const Resume = () => {
    return (
        <div className="resume-container">
            <img src={resume} alt="resume" className='resume-image' />
        </div>
    );
};

export default Resume;
