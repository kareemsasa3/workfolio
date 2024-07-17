import React from 'react';
import './EducationDetails.css';
import TypeWriterText from '../TypeWriterText';

const EducationDetails = ({ smallText, largeText }) => {
    return (
        <div className='education-details-container'>
            <div className='education-text large-font'>
                <TypeWriterText text={largeText} delay={3500} />
            </div>
            <div className='education-text small-font'>
                <TypeWriterText text={smallText} delay={4000} />
            </div>
        </div>
    );  
};

export default EducationDetails;