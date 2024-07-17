import React from 'react';
import './CertificationDetails.css';
import TypeWriterText from '../TypeWriterText';

const CertificationDetails = ({ smallText, largeText }) => {
    return (
        <div className='certification-details-container'>
            <div className='certification-text large-font'>
                <TypeWriterText text={largeText} delay={3500} />
            </div>
            <div className='certification-text small-font'>
                <TypeWriterText text={smallText} delay={4000} />
            </div>
        </div>
    );  
};

export default CertificationDetails;